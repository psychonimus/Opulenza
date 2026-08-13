import axios from "axios";

const BASE_URL = "https://ayurmitra.in/opulenza_reserve";

const REFRESH_BUFFER_MS = 5 * 60 * 1000;

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

function hasWindow() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getStored(key) {
  return hasWindow() ? localStorage.getItem(key) : null;
}

function setStored(key, value) {
  if (hasWindow()) localStorage.setItem(key, value);
}

function removeStored(key) {
  if (hasWindow()) localStorage.removeItem(key);
}

function dispatchAuthFailed() {
  if (hasWindow()) window.dispatchEvent(new Event("auth-failed"));
}

const ACCESS_TOKEN_FIELDS = ["accessToken", "token", "access_token", "jwt"];
const REFRESH_TOKEN_FIELDS = ["refreshToken", "refresh_token"];

function looksLikeJwt(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
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
      console.warn(`[Auth] Access token found under unexpected field "${key}" — consider adding it to ACCESS_TOKEN_FIELDS.`);
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

  if (num >= 1e11) {
    return num;
  }

  if (num >= 1e8) {
    return num * 1000;
  }

  return Date.now() + num * 1000;
}

function parseExpiresAt(expiresAt) {
  if (expiresAt === null || expiresAt === undefined || expiresAt === "") {
    return NaN;
  }

  if (typeof expiresAt === "number") {
    return classifyNumericExpiry(expiresAt);
  }

  const str = String(expiresAt).trim();

  if (/^\d+$/.test(str)) {
    const num = Number(str);
    if (Number.isNaN(num)) return NaN;
    return classifyNumericExpiry(num);
  }

  const normalized = str.replace(/(\.\d{3})\d+/, "$1");
  let t = new Date(normalized).getTime();
  if (!Number.isNaN(t)) return t;

  t = new Date(str).getTime();
  if (!Number.isNaN(t)) return t;

  return NaN;
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

function resolveExpiry(tokenData, accessToken) {
  const explicitExpiresAt =
    tokenData?.expiresAt ?? tokenData?.expires_at ?? tokenData?.expiration;

  if (explicitExpiresAt !== undefined && explicitExpiresAt !== null && explicitExpiresAt !== "") {
    const parsed = parseExpiresAt(explicitExpiresAt);
    if (!Number.isNaN(parsed)) return parsed;
  }

  const rawExpiresIn =
    tokenData?.expiresIn !== undefined && tokenData?.expiresIn !== null
      ? tokenData.expiresIn
      : tokenData?.expires_in;

  if (rawExpiresIn !== undefined && rawExpiresIn !== null) {
    const expiresIn = Number(rawExpiresIn);
    if (!Number.isNaN(expiresIn)) {
      return Date.now() + expiresIn * 1000;
    }
  }

  if (accessToken) {
    const expSeconds = decodeJwtExp(accessToken);
    if (expSeconds !== null) {
      console.log("[Auth] No expiry field in response — using JWT `exp` claim as fallback.");
      return expSeconds * 1000;
    }
  }

  return NaN;
}


export function setAuthUpdater(fn) {
  _authUpdater = fn;
}

export function clearTokens() {
  removeStored("token");
  removeStored("refreshToken");
  removeStored("expiresAt");
  if (scheduledTimer) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

export function saveTokens(tokenData) {
  if (!tokenData) return;

  const accessToken = extractAccessToken(tokenData);
  const refreshToken = extractRefreshToken(tokenData);
  const expiryMs = resolveExpiry(tokenData, accessToken);

  if (accessToken) {
    setStored("token", accessToken);
  }
  
  if (refreshToken) {
    setStored("refreshToken", refreshToken);
  }

  if (!Number.isNaN(expiryMs)) {
    setStored("expiresAt", String(expiryMs));
  }

  if (!Number.isNaN(expiryMs)) {
    scheduleAutoRefresh(expiryMs);
  } else {
    console.warn("[Auth] Could not determine token expiry — auto-refresh will not be scheduled.");
  }

  const storedAccessToken = getStored("token");
  const storedRefreshToken = getStored("refreshToken");
  const storedExpiresAt = getStored("expiresAt");
  console.log("[Auth] Access token stored:", !!storedAccessToken);
  console.log("[Auth] Refresh token stored:", !!storedRefreshToken);
  console.log("[Auth] Expiry stored:", storedExpiresAt);
}


function startHeartbeat() {
  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(() => {
    const token = getStored("token");
    const refreshToken = getStored("refreshToken");
    const expiresAt = getStored("expiresAt");

    if (!token || !refreshToken || !expiresAt) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
      return;
    }

    const expiryTime = parseExpiresAt(expiresAt);
    if (Number.isNaN(expiryTime)) return;

    const timeRemaining = expiryTime - Date.now();

    if (timeRemaining <= 0 || timeRemaining <= REFRESH_BUFFER_MS) {
      console.log("[Auth] Heartbeat: token expired or near expiry — refreshing now.");
      refreshAccessToken().catch(() => {});
    } else if (!scheduledTimer) {
      console.log("[Auth] Heartbeat: timer missing — rescheduling.");
      scheduleAutoRefresh(expiresAt);
    }
  }, 60 * 1000);
}

export function scheduleAutoRefresh(expiresAt) {
  if (scheduledTimer) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }

  if (!expiresAt) return;

  const expiryTime = parseExpiresAt(expiresAt);
  if (Number.isNaN(expiryTime)) {
    console.warn("[Auth] scheduleAutoRefresh: invalid expiry, skipping.", expiresAt);
    return;
  }

  const now = Date.now();
  const timeRemaining = expiryTime - now;

  // console.log(
  //   `[Auth] Token expires at: ${new Date(expiryTime).toISOString()} | ` +
  //   `Time remaining: ${Math.round(timeRemaining / 1000)}s`
  // );

  if (timeRemaining <= 0) {
    console.log("[Auth] Token already expired — refreshing immediately.");
    refreshAccessToken().catch(() => {});
    return;
  }

  if (timeRemaining <= REFRESH_BUFFER_MS) {
    console.log(
      `[Auth] Less than ${REFRESH_BUFFER_MS / 1000}s remaining — refreshing immediately.`
    );
    refreshAccessToken().catch(() => {});
    return;
  }

  const delay = timeRemaining - REFRESH_BUFFER_MS;
  const safeDelay = Math.min(delay, 2147483647);

  const scheduledFor = new Date(now + safeDelay).toISOString();
  // console.log(
  //   `[Auth] Refresh scheduled for ${scheduledFor} ` +
  //   `(${Math.round(safeDelay / 1000)}s from now, ${REFRESH_BUFFER_MS / 1000}s before expiry)`
  // );

  scheduledTimer = setTimeout(() => {
    console.log("[Auth] Scheduled refresh firing now.");
    refreshAccessToken().catch(() => {});
  }, safeDelay);

  startHeartbeat();
}

export function startTokenAutoRefresh() {
  if (!hasWindow()) return;

  const token = getStored("token");
  const refreshToken = getStored("refreshToken");
  const expiresAt = getStored("expiresAt");

  if (!token || !refreshToken || !expiresAt) return;

  const expiryTime = parseExpiresAt(expiresAt);
  if (Number.isNaN(expiryTime)) return;

  if (isTokenNearExpiry()) {
    refreshAccessToken().catch(() => {});
  } else {
    scheduleAutoRefresh(expiresAt);
  }
}

export function isTokenNearExpiry() {
  const expiresAt = getStored("expiresAt");
  if (!expiresAt) return false;

  const expiryTime = parseExpiresAt(expiresAt);
  if (Number.isNaN(expiryTime)) return false;

  const now = Date.now();
  const timeRemaining = expiryTime - now;

  return timeRemaining <= REFRESH_BUFFER_MS;
}

/* -------------------------------------------------------------------------
 * Refresh
 * ---------------------------------------------------------------------- */

export function refreshAccessToken() {
  if (refreshPromise) {
    console.log("[Auth] Refresh already in progress — reusing existing request.");
    return refreshPromise;
  }

  const storedRefreshToken = getStored("refreshToken");
  if (!storedRefreshToken) {
    console.warn("[Auth] No refresh token available — logging out.");
    clearTokens();
    dispatchAuthFailed();
    return Promise.reject(new Error("No refresh token available"));
  }

  console.log("[Auth] Starting token refresh...");

  refreshPromise = refreshApi
    .post("/api/auth/refresh", {
      refreshToken: storedRefreshToken,
      refresh_token: storedRefreshToken,
    })
    .then((response) => {
      const tokenData = response.data?.data ?? response.data;

      const newAccessToken = extractAccessToken(tokenData);
      const newRefreshToken = extractRefreshToken(tokenData);
      const resolvedExpiry = resolveExpiry(tokenData, newAccessToken);

      console.log("[Auth] Refresh response keys:", Object.keys(tokenData || {}));
      console.log("[Auth] New access token received:", !!newAccessToken);
      console.log("[Auth] New refresh token received:", !!newRefreshToken);
      console.log("[Auth] New expiry:", Number.isNaN(resolvedExpiry) ? null : new Date(resolvedExpiry).toISOString());

      if (!newAccessToken) {
        throw new Error("No access token returned from refresh endpoint.");
      }

      // saveTokens re-derives everything from tokenData itself (including
      // the refresh-token-rotation guard), so pass the raw payload through
      // rather than the locals above — this keeps a single source of truth.
      saveTokens(tokenData);

      console.log("[Auth] Token refresh succeeded.");

      if (typeof _authUpdater === "function") {
        _authUpdater(tokenData);
      }

      return newAccessToken;
    })
    .catch((error) => {
      console.error("[Auth] Token refresh failed:", error?.message || error);
      clearTokens();
      dispatchAuthFailed();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

/* -------------------------------------------------------------------------
 * Axios interceptors
 * ---------------------------------------------------------------------- */

function isAuthEndpointUrl(url) {
  const u = url || "";
  return u.includes("/auth/login") || u.includes("/auth/refresh");
}

// Set the Authorization header in a way that's safe whether config.headers
// is a plain object or an AxiosHeaders instance (axios v1+). Using the
// AxiosHeaders `.set()` method when available avoids the header silently
// not being picked up by the adapter, which is what was causing requests
// to go out without a (or with a stale) Authorization header.
function applyAuthHeader(config, token) {
  if (!token) return config;
  if (config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
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

    // Always read the latest token AFTER any refresh above completes, so a
    // request that triggered a refresh uses the new token, not one
    // captured before the refresh started.
    const token = getStored("token");
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
        // The refresh call itself was rejected — the refresh token is
        // dead. Don't loop on it; log the user out.
        clearTokens();
        dispatchAuthFailed();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const newAccessToken = await refreshAccessToken();
      applyAuthHeader(originalRequest, newAccessToken);
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

if (hasWindow()) {
  startTokenAutoRefresh();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;

    const token = getStored("token");
    const refreshToken = getStored("refreshToken");
    const expiresAt = getStored("expiresAt");

    if (!token || !refreshToken || !expiresAt) return;

    const expiryTime = parseExpiresAt(expiresAt);
    if (Number.isNaN(expiryTime)) return;

    const timeRemaining = expiryTime - Date.now();

    if (timeRemaining <= 0 || timeRemaining <= REFRESH_BUFFER_MS) {
      console.log("[Auth] Tab visible: token expired or near expiry — refreshing now.");
      refreshAccessToken().catch(() => {});
    } else if (!scheduledTimer) {
      console.log("[Auth] Tab visible: no timer running — rescheduling.");
      scheduleAutoRefresh(expiresAt);
    }
  });
}

export default api;