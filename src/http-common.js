import axios from "axios";

const BASE_URL = "https://ayurmitra.in/opulenza_reserve";

const REFRESH_BUFFER_MS = 5 * 60 * 1000;
const WEB_LOCK_NAME = "auth-refresh-lock";
const FALLBACK_CLAIM_KEY = "authRefreshFallbackClaim";
const FALLBACK_CLAIM_TTL_MS = 10 * 1000;
const FALLBACK_POLL_INTERVAL_MS = 100;
const FALLBACK_COORDINATION_TIMEOUT_MS = FALLBACK_CLAIM_TTL_MS + 5000;
const STORAGE_KEY = "authState";
const BROADCAST_CHANNEL_NAME = "auth-sync";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const refreshApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let _authUpdater = null;
let scheduledTimer = null;
let heartbeatInterval = null;
let refreshPromise = null;
let broadcastChannel = null;
let remoteRefreshInProgress = null;

function hasWindow() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function dispatchAuthFailed() {
  if (hasWindow()) window.dispatchEvent(new Event("auth-failed"));
}

function generateTabId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `tab_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const TAB_ID = generateTabId();

const ACCESS_TOKEN_FIELDS = ["accessToken", "token", "access_token", "jwt"];
const REFRESH_TOKEN_FIELDS = ["refreshToken", "refresh_token"];
const EXPIRY_FIELD_CANDIDATES = [
  "expiresIn",
  "expires_in",
  "expiresAt",
  "expires_at",
];

function looksLikeJwt(value) {
  return (
    typeof value === "string" &&
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
  );
}

function extractField(tokenData, candidateKeys) {
  for (const key of candidateKeys) {
    if (tokenData?.[key]) return tokenData[key];
  }
  return undefined;
}

function extractAccessToken(tokenData) {
  const known = extractField(tokenData, ACCESS_TOKEN_FIELDS);
  if (known) return known;

  for (const [key, value] of Object.entries(tokenData || {})) {
    if (!ACCESS_TOKEN_FIELDS.includes(key) && looksLikeJwt(value)) {
      console.warn(
        `[Auth] Access token found under unexpected field "${key}" — consider adding it to ACCESS_TOKEN_FIELDS.`,
      );
      return value;
    }
  }
  return undefined;
}

function extractRefreshToken(tokenData) {
  return extractField(tokenData, REFRESH_TOKEN_FIELDS);
}

function classifyNumericExpiry(num) {
  if (Number.isNaN(num)) return NaN;
  if (num >= 1e11) return num;
  if (num >= 1e8) return num * 1000;
  return Date.now() + num * 1000;
}

function decodeJwtExp(jwt) {
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return null;

    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4 !== 0) payload += "=";

    const binary = atob(payload);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);

    const json = JSON.parse(decoded);
    if (json && typeof json.exp === "number" && !Number.isNaN(json.exp)) {
      return json.exp;
    }
    return null;
  } catch (err) {
    console.warn("[Auth] Failed to decode JWT for exp fallback:", err);
    return null;
  }
}

function extractRawExpiry(tokenData) {
  for (const key of EXPIRY_FIELD_CANDIDATES) {
    const value = tokenData?.[key];
    if (value !== undefined && value !== null) {
      return { key, value };
    }
  }
  return null;
}

function resolveExpiry(tokenData, accessToken) {
  const rawExpiry = extractRawExpiry(tokenData);
  let fieldBasedExpiry = NaN;

  if (rawExpiry) {
    const numeric = Number(rawExpiry.value);
    if (!Number.isNaN(numeric)) {
      const resolved = classifyNumericExpiry(numeric);
      if (!Number.isNaN(resolved)) {
        fieldBasedExpiry = resolved;
        console.log(
          `[Auth] Expiry resolved from field "${rawExpiry.key}" with value`,
          rawExpiry.value,
          "->",
          new Date(resolved).toISOString(),
        );
      }
    } else {
      console.warn(
        `[Auth] Expiry field "${rawExpiry.key}" is not numeric:`,
        rawExpiry.value,
      );
    }
  }

  let jwtExpiryMs = NaN;
  if (accessToken) {
    const expSeconds = decodeJwtExp(accessToken);
    if (expSeconds !== null) {
      jwtExpiryMs = expSeconds * 1000;
    }
  }

  if (!Number.isNaN(fieldBasedExpiry) && !Number.isNaN(jwtExpiryMs)) {
    const driftMs = fieldBasedExpiry - jwtExpiryMs;
    if (Math.abs(driftMs) > 5000) {
      console.warn(
        "[Auth] EXPIRY MISMATCH: declared expiresAt field and JWT exp claim disagree by",
        Math.round(driftMs / 1000),
        "seconds.",
        {
          fieldValue: rawExpiry?.value,
          fieldResolved: new Date(fieldBasedExpiry).toISOString(),
          jwtExp: new Date(jwtExpiryMs).toISOString(),
        },
      );
    }
    return jwtExpiryMs < fieldBasedExpiry ? jwtExpiryMs : fieldBasedExpiry;
  }

  if (!Number.isNaN(fieldBasedExpiry)) return fieldBasedExpiry;

  if (!Number.isNaN(jwtExpiryMs)) {
    console.log(
      "[Auth] No usable expiry field in response — using JWT `exp` claim as fallback.",
    );
    return jwtExpiryMs;
  }

  return NaN;
}

function readAuthState() {
  if (!hasWindow()) return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch (err) {
    console.warn("[Auth] Stored authState was corrupted — clearing it.");
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function mirrorLegacyKeys(state) {
  if (!hasWindow()) return;

  if (state?.accessToken) {
    localStorage.setItem("token", state.accessToken);
  } else {
    localStorage.removeItem("token");
  }

  if (state?.refreshToken) {
    localStorage.setItem("refreshToken", state.refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }

  if (
    state?.expiresAt !== undefined &&
    state?.expiresAt !== null &&
    !Number.isNaN(Number(state.expiresAt))
  ) {
    localStorage.setItem("expiresAt", String(state.expiresAt));
  } else {
    localStorage.removeItem("expiresAt");
  }
}

function writeAuthState(state) {
  if (!hasWindow()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  mirrorLegacyKeys(state);
}

function migrateLegacyKeysIfNeeded() {
  if (!hasWindow()) return;
  if (localStorage.getItem(STORAGE_KEY)) return;

  const legacyToken = localStorage.getItem("token");
  const legacyRefresh = localStorage.getItem("refreshToken");
  const legacyExpiresAt = localStorage.getItem("expiresAt");

  if (!legacyToken && !legacyRefresh && !legacyExpiresAt) return;

  console.log("[Auth] Migrating legacy localStorage keys into authState.");

  writeAuthState({
    accessToken: legacyToken || null,
    refreshToken: legacyRefresh || null,
    expiresAt: legacyExpiresAt ? Number(legacyExpiresAt) : null,
  });
}

function getAccessToken() {
  return readAuthState()?.accessToken || null;
}

function getRefreshTokenValue() {
  return readAuthState()?.refreshToken || null;
}

function getExpiresAtMs() {
  const state = readAuthState();
  if (!state || state.expiresAt === undefined || state.expiresAt === null)
    return null;
  const numeric = Number(state.expiresAt);
  return Number.isNaN(numeric) ? null : numeric;
}

function logRemainingSeconds(expiresAtMs) {
  if (expiresAtMs === null || expiresAtMs === undefined) return;
  const remainingSeconds = Math.round((expiresAtMs - Date.now()) / 1000);
  console.log("[Auth] remainingSeconds:", remainingSeconds);
}

export function setAuthUpdater(fn) {
  _authUpdater = fn;
}

function clearLocalAuthState() {
  if (hasWindow()) localStorage.removeItem(STORAGE_KEY);
  mirrorLegacyKeys(null);
  releaseFallbackClaim();
  if (scheduledTimer) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

export function clearTokens() {
  clearLocalAuthState();
  broadcastAuthCleared();
}

export function saveTokens(tokenData) {
  if (!tokenData) return;

  const incomingAccessToken = extractAccessToken(tokenData);
  const incomingRefreshToken = extractRefreshToken(tokenData);
  const incomingExpiryMs = resolveExpiry(tokenData, incomingAccessToken);

  const previous = readAuthState();

  const nextState = {
    accessToken: incomingAccessToken || previous?.accessToken || null,
    refreshToken: incomingRefreshToken || previous?.refreshToken || null,
    expiresAt: !Number.isNaN(incomingExpiryMs)
      ? incomingExpiryMs
      : (previous?.expiresAt ?? null),
  };

  writeAuthState(nextState);

  if (!Number.isNaN(incomingExpiryMs)) {
    scheduleAutoRefresh(incomingExpiryMs);
  } else {
    console.warn(
      "[Auth] Could not determine token expiry — auto-refresh will not be scheduled.",
    );
  }

  console.log("[Auth] accessTokenExists:", !!nextState.accessToken);
  console.log("[Auth] refreshTokenExists:", !!nextState.refreshToken);
  console.log("[Auth] expiresAt:", nextState.expiresAt);

  broadcastAuthUpdated();
}

function startHeartbeat() {
  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(() => {
    const state = readAuthState();

    if (
      !state?.accessToken ||
      !state?.refreshToken ||
      state.expiresAt == null
    ) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
      return;
    }

    const expiryTime = Number(state.expiresAt);
    if (Number.isNaN(expiryTime)) return;

    const timeRemaining = expiryTime - Date.now();

    if (timeRemaining <= 0 || timeRemaining <= REFRESH_BUFFER_MS) {
      console.log(
        "[Auth] Heartbeat: token expired or near expiry — refreshing now.",
      );
      refreshAccessToken().catch(() => {});
    } else if (!scheduledTimer) {
      console.log("[Auth] Heartbeat: timer missing — rescheduling.");
      scheduleAutoRefresh(expiryTime);
    }
  }, 60 * 1000);
}

export function scheduleAutoRefresh(expiresAt) {
  if (scheduledTimer) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }

  const expiryTime = Number(expiresAt);
  if (!expiryTime || Number.isNaN(expiryTime)) return;

  const now = Date.now();
  const timeRemaining = expiryTime - now;

  if (timeRemaining <= 0) {
    console.log("[Auth] Token already expired — refreshing immediately.");
    refreshAccessToken().catch(() => {});
    startHeartbeat();
    return;
  }

  if (timeRemaining <= REFRESH_BUFFER_MS) {
    console.log(
      `[Auth] Less than ${REFRESH_BUFFER_MS / 1000}s remaining — refreshing immediately.`,
    );
    refreshAccessToken().catch(() => {});
    startHeartbeat();
    return;
  }

  const delay = timeRemaining - REFRESH_BUFFER_MS;
  const safeDelay = Math.min(delay, 2147483647);

  const scheduledFor = new Date(now + safeDelay).toISOString();
  console.log(
    `[Auth] Refresh scheduled for ${scheduledFor} ` +
      `(${Math.round(safeDelay / 1000)}s from now, ${REFRESH_BUFFER_MS / 1000}s before expiry)`,
  );

  scheduledTimer = setTimeout(() => {
    console.log("[Auth] Scheduled refresh firing now.");
    refreshAccessToken().catch(() => {});
  }, safeDelay);

  startHeartbeat();
}

export function startTokenAutoRefresh() {
  if (!hasWindow()) return;

  const state = readAuthState();
  if (!state?.accessToken || !state?.refreshToken || state.expiresAt == null)
    return;

  const expiresAt = Number(state.expiresAt);
  if (Number.isNaN(expiresAt)) return;

  logRemainingSeconds(expiresAt);

  if (isTokenNearExpiry()) {
    refreshAccessToken().catch(() => {});
  } else {
    scheduleAutoRefresh(expiresAt);
  }
}

export function isTokenNearExpiry() {
  const expiresAt = getExpiresAtMs();
  if (expiresAt === null) return false;

  const timeRemaining = expiresAt - Date.now();
  return timeRemaining <= REFRESH_BUFFER_MS;
}

function hasWebLocks() {
  return (
    typeof navigator !== "undefined" &&
    navigator.locks &&
    typeof navigator.locks.request === "function"
  );
}

function acquireFallbackClaim() {
  if (!hasWindow()) return true;

  const now = Date.now();
  const existingRaw = localStorage.getItem(FALLBACK_CLAIM_KEY);

  if (existingRaw) {
    let existing = null;
    try {
      existing = JSON.parse(existingRaw);
    } catch (err) {
      existing = null;
    }

    if (existing && existing.owner === TAB_ID) {
      return true;
    }

    if (
      existing &&
      !Number.isNaN(Number(existing.ts)) &&
      now - Number(existing.ts) < FALLBACK_CLAIM_TTL_MS
    ) {
      return false;
    }
  }

  localStorage.setItem(
    FALLBACK_CLAIM_KEY,
    JSON.stringify({ owner: TAB_ID, ts: now }),
  );

  const verifyRaw = localStorage.getItem(FALLBACK_CLAIM_KEY);
  let verify = null;
  try {
    verify = JSON.parse(verifyRaw);
  } catch (err) {
    verify = null;
  }

  return !!verify && verify.owner === TAB_ID;
}

function releaseFallbackClaim() {
  if (!hasWindow()) return;

  const existingRaw = localStorage.getItem(FALLBACK_CLAIM_KEY);
  if (!existingRaw) return;

  let existing = null;
  try {
    existing = JSON.parse(existingRaw);
  } catch (err) {
    return;
  }

  if (existing && existing.owner === TAB_ID) {
    localStorage.removeItem(FALLBACK_CLAIM_KEY);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRemoteRefreshActive() {
  if (!remoteRefreshInProgress) return false;
  if (
    Date.now() - remoteRefreshInProgress.ts >
    FALLBACK_COORDINATION_TIMEOUT_MS
  ) {
    remoteRefreshInProgress = null;
    return false;
  }
  return true;
}

function broadcastRefreshActive() {
  const channel = getBroadcastChannel();
  if (channel)
    channel.postMessage({
      type: "refresh-active",
      tabId: TAB_ID,
      ts: Date.now(),
    });
}

function broadcastRefreshDone() {
  const channel = getBroadcastChannel();
  if (channel) channel.postMessage({ type: "refresh-done", tabId: TAB_ID });
}

async function performRefreshNetworkCall(refreshTokenToSend) {
  console.log("[Auth] refreshStarted:", true);

  console.log("[Auth] REFRESH DEBUG", {
    endpoint: "/api/auth/refresh",
    refreshTokenExists: !!refreshTokenToSend,
    refreshTokenLength: refreshTokenToSend?.length,
    authStateRefreshTokenExists: !!getRefreshTokenValue(),
    accessTokenExists: !!getAccessToken(),
    expiresAt: getExpiresAtMs(),
    remainingSeconds: getExpiresAtMs()
      ? Math.round((getExpiresAtMs() - Date.now()) / 1000)
      : null,
  });

  let response;
  try {
    response = await refreshApi.post("/api/auth/refresh", {
      Token: refreshTokenToSend,
    });
  } catch (err) {
    console.log("[Auth] REFRESH ERROR", {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      responseData: err?.response?.data,
      requestUrl: err?.config?.url,
    });
    throw err;
  }

  const tokenData = response.data?.data ?? response.data;

  const newAccessToken = extractAccessToken(tokenData);
  const newRefreshToken = extractRefreshToken(tokenData);
  const resolvedExpiry = resolveExpiry(tokenData, newAccessToken);

  console.log("[Auth] REFRESH RESPONSE", {
    status: response.status,
    keys: Object.keys(tokenData || {}),
    accessTokenReceived: !!newAccessToken,
    refreshTokenReceived: !!newRefreshToken,
    expiryReceived: Number.isNaN(resolvedExpiry) ? null : resolvedExpiry,
  });

  if (!newAccessToken) {
    throw new Error("No access token returned from refresh endpoint.");
  }

  saveTokens(tokenData);
  console.log("[Auth] refreshSucceeded:", true);

  if (typeof _authUpdater === "function") {
    _authUpdater(tokenData);
  }

  return newAccessToken;
}

async function runRefreshOnceLockHeld(refreshTokenAtCallTime) {
  const currentRefreshToken = getRefreshTokenValue();

  if (
    currentRefreshToken &&
    refreshTokenAtCallTime &&
    currentRefreshToken !== refreshTokenAtCallTime
  ) {
    const currentAccessToken = getAccessToken();
    if (currentAccessToken) {
      console.log(
        "[Auth] Refresh token was already rotated by another tab — reusing its result instead of refreshing again.",
      );
      return currentAccessToken;
    }
  }

  if (!currentRefreshToken) {
    throw new Error("Refresh token was cleared before refresh could run.");
  }

  return performRefreshNetworkCall(currentRefreshToken);
}

async function runCoordinatedRefresh(refreshTokenAtCallTime) {
  if (hasWebLocks()) {
    return navigator.locks.request(WEB_LOCK_NAME, { mode: "exclusive" }, () =>
      runRefreshOnceLockHeld(refreshTokenAtCallTime),
    );
  }

  console.warn(
    "[Auth] Web Locks API unavailable in this browser. Falling back to a best-effort " +
      "coordination scheme (BroadcastChannel + a localStorage claim). This is NOT a true " +
      "mutex — the browser gives no cross-tab atomic primitive outside Web Locks — so two " +
      "tabs can still both believe they hold the claim in a narrow window. What IS guaranteed " +
      "is that this tab re-reads authState immediately before sending any refresh request and " +
      "will reuse a token another tab already rotated in rather than sending a token known to " +
      "be stale.",
  );

  return runFallbackRefresh(refreshTokenAtCallTime);
}

function randomJitterMs(baseMs, spreadMs) {
  return baseMs + Math.floor(Math.random() * spreadMs);
}

async function runFallbackRefresh(refreshTokenAtCallTime) {
  const deadline = Date.now() + FALLBACK_COORDINATION_TIMEOUT_MS;

  await sleep(randomJitterMs(0, 150));

  while (Date.now() < deadline) {
    const currentRefreshToken = getRefreshTokenValue();
    if (
      currentRefreshToken &&
      refreshTokenAtCallTime &&
      currentRefreshToken !== refreshTokenAtCallTime
    ) {
      const currentAccessToken = getAccessToken();
      if (currentAccessToken) {
        console.log("[Auth] fallback:", {
          anotherTabRefreshed: true,
          usingLatestAuthState: true,
        });
        return currentAccessToken;
      }
    }

    if (isRemoteRefreshActive()) {
      console.log("[Auth] refreshWaiting:", true);
      await sleep(
        randomJitterMs(FALLBACK_POLL_INTERVAL_MS, FALLBACK_POLL_INTERVAL_MS),
      );
      continue;
    }

    if (acquireFallbackClaim()) {
      broadcastRefreshActive();
      try {
        return await runRefreshOnceLockHeld(refreshTokenAtCallTime);
      } finally {
        releaseFallbackClaim();
        broadcastRefreshDone();
      }
    }

    await sleep(
      randomJitterMs(FALLBACK_POLL_INTERVAL_MS, FALLBACK_POLL_INTERVAL_MS),
    );
  }

  throw new Error(
    "Timed out waiting for cross-tab refresh coordination without Web Locks support.",
  );
}

export function refreshAccessToken() {
  if (refreshPromise) {
    console.log(
      "[Auth] Refresh already in progress in this tab — reusing existing request.",
    );
    return refreshPromise;
  }

  const storedRefreshToken = getRefreshTokenValue();

  if (!storedRefreshToken) {
    console.warn("[Auth] No refresh token available — logging out.");
    clearTokens();
    dispatchAuthFailed();
    return Promise.reject(new Error("No refresh token available"));
  }

  refreshPromise = runCoordinatedRefresh(storedRefreshToken)
    .catch((error) => {
      console.error("[Auth] Token refresh failed:", error?.message || error);

      const status = error?.response?.status;
      const isDefinitiveRejection = status === 401 || status === 403;

      if (isDefinitiveRejection) {
        const latestRefreshToken = getRefreshTokenValue();
        const latestAccessToken = getAccessToken();
        const wasRotatedConcurrently =
          latestRefreshToken &&
          latestRefreshToken !== storedRefreshToken &&
          !!latestAccessToken;

        if (wasRotatedConcurrently) {
          console.log(
            "[Auth] anotherTabRefreshed:",
            true,
            "usingLatestAuthState:",
            true,
          );
          console.log(
            "[Auth] Refresh endpoint rejected a refresh token that another tab had already " +
              "rotated out from under this request — another tab already refreshed the session " +
              "successfully. Using its latest access token instead of failing this request.",
          );
          reconcileTimerWithStoredState();
          return latestAccessToken;
        }

        console.warn(
          "[Auth] Refresh endpoint explicitly rejected the refresh token — logging out.",
        );
        clearTokens();
        dispatchAuthFailed();
      } else {
        console.warn(
          "[Auth] Refresh failed due to a network/server error, not an invalid refresh token — keeping the existing session for retry.",
        );
      }

      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function isAuthEndpointUrl(url) {
  const u = url || "";
  return u.includes("/auth/login") || u.includes("/auth/refresh");
}

function applyAuthHeader(config, token) {
  if (!token) return config;
  if (config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

api.interceptors.request.use(
  async (config) => {
    const isAuthEndpoint = isAuthEndpointUrl(config.url);

    if (!config._retry && !isAuthEndpoint && isTokenNearExpiry()) {
      try {
        await refreshAccessToken();
      } catch (error) {
        return Promise.reject(error);
      }
    }
    const token = getAccessToken();
    return applyAuthHeader(config, token);
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshEndpoint = isAuthEndpointUrl(originalRequest?.url);

    console.log("[Auth] API 401 URL:", originalRequest?.url);
    console.log("[Auth] Refresh endpoint:", isRefreshEndpoint);

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isRefreshEndpoint
    ) {
      if (isRefreshEndpoint && error.response?.status === 401) {
        clearTokens();
        dispatchAuthFailed();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    console.log(
      "[Auth] Retrying original request after refresh:",
      originalRequest.url,
    );
    try {
      const newAccessToken = await refreshAccessToken();
      applyAuthHeader(originalRequest, newAccessToken);
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

function reconcileTimerWithStoredState() {
  const state = readAuthState();
  if (!state?.accessToken || !state?.refreshToken || state.expiresAt == null)
    return;

  const expiresAt = Number(state.expiresAt);
  if (Number.isNaN(expiresAt)) return;

  logRemainingSeconds(expiresAt);
  scheduleAutoRefresh(expiresAt);
}

function getBroadcastChannel() {
  if (!hasWindow() || typeof BroadcastChannel === "undefined") return null;

  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    broadcastChannel.onmessage = (event) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "auth-cleared") {
        console.log("[Auth] Received auth-cleared broadcast from another tab.");
        clearLocalAuthState();
        dispatchAuthFailed();
      } else if (data.type === "auth-updated") {
        console.log("[Auth] Received auth-updated broadcast from another tab.");
        reconcileTimerWithStoredState();
      } else if (data.type === "refresh-active" && data.tabId !== TAB_ID) {
        console.log(
          "[Auth] Received refresh-active broadcast — another tab is refreshing.",
        );
        remoteRefreshInProgress = {
          ts: Number(data.ts) || Date.now(),
          tabId: data.tabId,
        };
      } else if (data.type === "refresh-done" && data.tabId !== TAB_ID) {
        console.log("[Auth] Received refresh-done broadcast from another tab.");
        remoteRefreshInProgress = null;
        reconcileTimerWithStoredState();
      }
    };
  }

  return broadcastChannel;
}

function broadcastAuthUpdated() {
  const channel = getBroadcastChannel();
  if (channel) channel.postMessage({ type: "auth-updated" });
}

function broadcastAuthCleared() {
  const channel = getBroadcastChannel();
  if (channel) channel.postMessage({ type: "auth-cleared" });
}

if (hasWindow()) {
  migrateLegacyKeysIfNeeded();
  getBroadcastChannel();
  startTokenAutoRefresh();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;

    const state = readAuthState();
    if (!state?.accessToken || !state?.refreshToken || state.expiresAt == null)
      return;

    const expiresAt = Number(state.expiresAt);
    if (Number.isNaN(expiresAt)) return;

    logRemainingSeconds(expiresAt);
    const timeRemaining = expiresAt - Date.now();

    if (timeRemaining <= 0 || timeRemaining <= REFRESH_BUFFER_MS) {
      console.log(
        "[Auth] Tab visible: token expired or near expiry — refreshing now.",
      );
      refreshAccessToken().catch(() => {});
    } else if (!scheduledTimer) {
      console.log("[Auth] Tab visible: no timer running — rescheduling.");
      scheduleAutoRefresh(expiresAt);
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;

    if (event.newValue === null) {
      clearLocalAuthState();
      dispatchAuthFailed();
    } else {
      reconcileTimerWithStoredState();
    }
  });

  window.addEventListener("beforeunload", () => {
    releaseFallbackClaim();
    if (broadcastChannel) {
      broadcastChannel.close();
      broadcastChannel = null;
    }
  });
}

export default api;
