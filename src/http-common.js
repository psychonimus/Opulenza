import axios from "axios";

const BASE_URL = "https://ayurmitra.in/opulenza_reserve";
const STORAGE_KEY = "authState";
const META_KEY = "authRefreshMeta";
const BROADCAST_CHANNEL_NAME = "auth-sync";
const WEB_LOCK_NAME = "auth-refresh-lock";
const FALLBACK_CLAIM_KEY = "authRefreshFallbackClaim";
const FALLBACK_CLAIM_TTL_MS = 10_000;
const FALLBACK_POLL_MS = 100;
const FALLBACK_TIMEOUT_MS = FALLBACK_CLAIM_TTL_MS + 5_000;
const REFRESH_BUFFER_MS = 10 * 60 * 1_000;
const BACKOFF_MS = 30_000;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
const refreshApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let _authUpdater = null;
let _timer = null;
let _heartbeat = null;
let _refreshPromise = null;
let _channel = null;
let _remoteRefresh = null;

const TAB_ID =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `tab_${Date.now()}_${Math.random().toString(36).slice(2)}`;

const mask = (t) => (t ? `${t.slice(0, 8)}...${t.slice(-8)}` : null);
const hasEnv = () =>
  typeof window !== "undefined" && typeof localStorage !== "undefined";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (base, spread) => base + Math.floor(Math.random() * spread);

function readMeta() {
  if (!hasEnv()) return null;
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeMeta(patch) {
  if (!hasEnv()) return;
  const current = readMeta() || {};
  localStorage.setItem(META_KEY, JSON.stringify({ ...current, ...patch }));
}

function clearMeta() {
  if (hasEnv()) localStorage.removeItem(META_KEY);
}

function setGlobalBackoff(backoffUntil) {
  writeMeta({ backoffUntil, backoffTabId: TAB_ID });
  broadcast({ type: "backoff-active", backoffUntil });
}

function clearGlobalBackoff() {
  writeMeta({ backoffUntil: null, backoffTabId: null });
}

function isBackoffActive() {
  const meta = readMeta();
  if (!meta?.backoffUntil) return false;
  return Date.now() < Number(meta.backoffUntil);
}

function backoffRemainingMs() {
  const meta = readMeta();
  if (!meta?.backoffUntil) return 0;
  return Math.max(0, Number(meta.backoffUntil) - Date.now());
}

function decodeJwtExp(jwt) {
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4) payload += "=";
    const decoded = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(payload), (c) => c.charCodeAt(0)),
      ),
    );
    return typeof decoded?.exp === "number" && !Number.isNaN(decoded.exp)
      ? decoded.exp
      : null;
  } catch {
    return null;
  }
}

function classifyExpiry(num) {
  if (num >= 1e12) return num;
  if (num >= 1e9) return num * 1000;
  return Date.now() + num * 1000;
}

function resolveExpiry(data, accessToken) {
  let fieldMs = NaN;
  for (const key of ["expiresIn", "expires_in", "expiresAt", "expires_at"]) {
    const val = data?.[key];
    if (val != null) {
      const n = Number(val);
      if (!Number.isNaN(n)) fieldMs = classifyExpiry(n);
      break;
    }
  }
  const jwtExp = accessToken ? decodeJwtExp(accessToken) : null;
  const jwtMs = jwtExp !== null ? jwtExp * 1000 : NaN;
  return !Number.isNaN(jwtMs) ? jwtMs : fieldMs;
}

function extractAT(data) {
  const AT_FIELDS = ["accessToken", "token", "access_token", "jwt"];
  for (const k of AT_FIELDS) if (data?.[k]) return data[k];
  for (const [k, v] of Object.entries(data || {})) {
    if (
      !AT_FIELDS.includes(k) &&
      typeof v === "string" &&
      /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(v)
    )
      return v;
  }
  return undefined;
}

function extractRT(data) {
  for (const k of ["refreshToken", "refresh_token"])
    if (data?.[k]) return data[k];
  return undefined;
}

function readState() {
  if (!hasEnv()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function getAT() {
  return readState()?.accessToken || null;
}
function getRT() {
  return readState()?.refreshToken || null;
}
function getExpiry() {
  const v = readState()?.expiresAt;
  if (v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function writeLegacy(state) {
  if (!hasEnv()) return;
  if (state?.accessToken) localStorage.setItem("token", state.accessToken);
  else localStorage.removeItem("token");
  if (state?.refreshToken)
    localStorage.setItem("refreshToken", state.refreshToken);
  else localStorage.removeItem("refreshToken");
  if (state?.expiresAt != null && !Number.isNaN(Number(state.expiresAt)))
    localStorage.setItem("expiresAt", String(state.expiresAt));
  else localStorage.removeItem("expiresAt");
}

function commitState(state) {
  if (!hasEnv()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  writeLegacy(state);
}

function dispatch(ev) {
  if (hasEnv()) window.dispatchEvent(new Event(ev));
}

function clearTimers() {
  if (_timer) {
    clearTimeout(_timer);
    _timer = null;
  }
  if (_heartbeat) {
    clearInterval(_heartbeat);
    _heartbeat = null;
  }
}

function clearLocalState() {
  if (hasEnv()) localStorage.removeItem(STORAGE_KEY);
  writeLegacy(null);
  releaseClaim();
  clearTimers();
}

export function clearTokens() {
  clearLocalState();
  clearMeta();
  broadcast({ type: "auth-cleared" });
}

export function saveTokens(data) {
  if (!data) return;
  const at = extractAT(data);
  const rt = extractRT(data);
  const expiryMs = resolveExpiry(data, at);
  const prev = readState();
  const nextRT =
    rt !== undefined && rt !== null && rt !== ""
      ? rt
      : (prev?.refreshToken ?? null);
  const state = {
    accessToken: at || prev?.accessToken || null,
    refreshToken: nextRT,
    expiresAt: !Number.isNaN(expiryMs) ? expiryMs : (prev?.expiresAt ?? null),
  };
  const expired = !Number.isNaN(expiryMs) && expiryMs <= Date.now();
  if (expired) {
    const backoffUntil = Date.now() + BACKOFF_MS;
    setGlobalBackoff(backoffUntil);
  } else {
    clearGlobalBackoff();
  }
  commitState(state);
  if (!expired && !Number.isNaN(expiryMs)) scheduleRefresh(expiryMs);
  broadcast({ type: "auth-updated" });
}

function storeRefreshedTokens(data, prevRT) {
  const at = extractAT(data);
  if (!at) throw new Error("[Auth] No access token in refresh response.");
  const rt = extractRT(data);
  const expiryMs = resolveExpiry(data, at);
  const prev = readState();
  const nextRT =
    rt !== undefined && rt !== null && rt !== ""
      ? rt
      : (prev?.refreshToken ?? null);
  const state = {
    accessToken: at,
    refreshToken: nextRT,
    expiresAt: !Number.isNaN(expiryMs) ? expiryMs : (prev?.expiresAt ?? null),
  };
  const rotated = nextRT !== prevRT;
  const expired = !Number.isNaN(expiryMs) && expiryMs <= Date.now();
  console.log(
    `[Auth] tabId:${TAB_ID} AT:${mask(at)} prevRT:${mask(prevRT)} newRT:${mask(nextRT)} rotated:${rotated} expired:${expired}`,
  );
  if (expired) {
    const backoffUntil = Date.now() + BACKOFF_MS;
    setGlobalBackoff(backoffUntil);
    console.error(
      `[Auth] Backend issued expired AT. Global backoff until ${new Date(backoffUntil).toISOString()}`,
    );
  } else {
    clearGlobalBackoff();
  }
  commitState(state);
  if (!expired && !Number.isNaN(expiryMs)) {
    scheduleRefresh(expiryMs);
  }
  broadcast({ type: "auth-updated" });
  return at;
}

function canRefresh(tag) {
  if (isBackoffActive()) {
    console.warn(
      `[Auth] Refresh suppressed (${tag}): global backoff ${Math.round(backoffRemainingMs() / 1000)}s remaining.`,
    );
    return false;
  }
  return true;
}

function rejectExpiredRequest() {
  return Promise.reject(
    Object.assign(new Error("Access token expired — refresh backoff active."), {
      _authBackoff: true,
    }),
  );
}

function isExpiredNow() {
  const exp = getExpiry();
  return exp !== null && exp <= Date.now();
}

function startHeartbeat() {
  if (_heartbeat) return;
  _heartbeat = setInterval(() => {
    const state = readState();
    if (
      !state?.accessToken ||
      !state?.refreshToken ||
      state.expiresAt == null
    ) {
      clearInterval(_heartbeat);
      _heartbeat = null;
      return;
    }
    const exp = Number(state.expiresAt);
    if (Number.isNaN(exp)) return;
    if (exp - Date.now() <= REFRESH_BUFFER_MS) {
      if (canRefresh("heartbeat")) refreshAccessToken().catch(() => {});
    } else if (!_timer) {
      scheduleRefresh(exp);
    }
  }, 60_000);
}

export function scheduleRefresh(expiresAt) {
  if (_timer) {
    clearTimeout(_timer);
    _timer = null;
  }
  const exp = Number(expiresAt);
  if (!exp || Number.isNaN(exp)) return;
  const remaining = exp - Date.now();
  if (remaining <= 0 || remaining <= REFRESH_BUFFER_MS) {
    if (canRefresh("scheduleRefresh:immediate"))
      refreshAccessToken().catch(() => {});
    startHeartbeat();
    return;
  }
  const delay = Math.min(remaining - REFRESH_BUFFER_MS, 2_147_483_647);
  console.log(
    `[Auth] Refresh scheduled in ${Math.round(delay / 1000)}s (at ${new Date(Date.now() + delay).toISOString()})`,
  );
  _timer = setTimeout(() => {
    console.log("[Auth] Timer fired.");
    refreshAccessToken().catch(() => {});
  }, delay);
  startHeartbeat();
}

export const scheduleAutoRefresh = scheduleRefresh;

export function startTokenAutoRefresh() {
  if (!hasEnv()) return;
  const state = readState();
  if (!state?.accessToken || !state?.refreshToken || state.expiresAt == null)
    return;
  const exp = Number(state.expiresAt);
  if (Number.isNaN(exp)) return;
  console.log(
    `[Auth] Startup: ${Math.round((exp - Date.now()) / 1000)}s until expiry.`,
  );
  if (exp - Date.now() <= REFRESH_BUFFER_MS) {
    if (canRefresh("startup")) refreshAccessToken().catch(() => {});
  } else {
    scheduleRefresh(exp);
  }
}

export function isTokenNearExpiry() {
  const exp = getExpiry();
  return exp !== null && exp - Date.now() <= REFRESH_BUFFER_MS;
}

export function setAuthUpdater(fn) {
  _authUpdater = fn;
}

function hasLocks() {
  return (
    typeof navigator !== "undefined" &&
    navigator.locks &&
    typeof navigator.locks.request === "function"
  );
}

function parseClaim(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function acquireClaim() {
  if (!hasEnv()) return true;
  const now = Date.now();
  const claim = parseClaim(localStorage.getItem(FALLBACK_CLAIM_KEY));
  if (claim?.owner === TAB_ID) return true;
  if (
    claim &&
    !Number.isNaN(Number(claim.ts)) &&
    now - Number(claim.ts) < FALLBACK_CLAIM_TTL_MS
  )
    return false;
  localStorage.setItem(
    FALLBACK_CLAIM_KEY,
    JSON.stringify({ owner: TAB_ID, ts: now }),
  );
  const verify = parseClaim(localStorage.getItem(FALLBACK_CLAIM_KEY));
  return verify?.owner === TAB_ID;
}

function releaseClaim() {
  if (!hasEnv()) return;
  const claim = parseClaim(localStorage.getItem(FALLBACK_CLAIM_KEY));
  if (claim?.owner === TAB_ID) localStorage.removeItem(FALLBACK_CLAIM_KEY);
}

function isRemoteActive() {
  if (!_remoteRefresh) return false;
  if (Date.now() - _remoteRefresh.ts > FALLBACK_TIMEOUT_MS) {
    _remoteRefresh = null;
    return false;
  }
  return true;
}

function broadcast(msg) {
  const ch = getChannel();
  if (ch) ch.postMessage({ ...msg, tabId: TAB_ID });
}

function reconcileTimer() {
  if (isBackoffActive()) return;
  const state = readState();
  if (!state?.accessToken || !state?.refreshToken || state.expiresAt == null)
    return;
  const exp = Number(state.expiresAt);
  if (!Number.isNaN(exp)) scheduleRefresh(exp);
}

function getChannel() {
  if (!hasEnv() || typeof BroadcastChannel === "undefined") return null;
  if (!_channel) {
    _channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    _channel.onmessage = ({ data }) => {
      if (!data || typeof data !== "object") return;
      if (data.type === "auth-cleared") {
        clearLocalState();
        dispatch("auth-failed");
      } else if (data.type === "auth-updated") reconcileTimer();
      else if (data.type === "backoff-active") {
        writeMeta({
          backoffUntil: data.backoffUntil,
          backoffTabId: data.tabId,
        });
        console.warn(
          `[Auth] Cross-tab backoff received until ${new Date(data.backoffUntil).toISOString()}`,
        );
      } else if (data.type === "refresh-active" && data.tabId !== TAB_ID)
        _remoteRefresh = {
          ts: Number(data.ts) || Date.now(),
          tabId: data.tabId,
        };
      else if (data.type === "refresh-done" && data.tabId !== TAB_ID) {
        _remoteRefresh = null;
        reconcileTimer();
      }
    };
  }
  return _channel;
}

function isRotatedByOtherTab(tokenAtStart) {
  const latestRT = getRT();
  const latestAT = getAT();
  const latestExp = getExpiry();
  const atJwtExp = latestAT ? decodeJwtExp(latestAT) : null;
  const atValid =
    latestAT &&
    (atJwtExp !== null
      ? atJwtExp * 1000 > Date.now()
      : latestExp !== null && latestExp > Date.now());
  return latestRT !== null && latestRT !== tokenAtStart && atValid;
}

function runCoordinatedRefresh(token) {
  return hasLocks()
    ? navigator.locks.request(WEB_LOCK_NAME, { mode: "exclusive" }, () =>
        runOnceLockHeld(token),
      )
    : runFallback(token);
}

async function doRefreshRequest(tokenAtStart) {
  if (isBackoffActive()) {
    throw Object.assign(
      new Error("Access token expired — refresh backoff active."),
      { _authBackoff: true },
    );
  }
  const rtToSend = getRT();
  if (!rtToSend)
    throw new Error("[Auth] No refresh token before network call.");
  if (rtToSend !== tokenAtStart) {
    console.log(
      `[Auth] RT changed before POST. tokenAtStart:${mask(tokenAtStart)} current:${mask(rtToSend)}`,
    );
    if (isRotatedByOtherTab(tokenAtStart)) return getAT();
    const err = new Error("Token changed during refresh coordination.");
    err._tokenRotatedStale = true;
    throw err;
  }
  console.log(
    `[Auth] POST /api/auth/refresh tabId:${TAB_ID} RT:${mask(rtToSend)}`,
  );
  let response;
  try {
    response = await refreshApi.post("/api/auth/refresh", { Token: rtToSend });
  } catch (err) {
    console.warn(
      `[Auth] Refresh network error: ${err?.response?.status ?? "no response"} tabId:${TAB_ID}`,
    );
    throw err;
  }
  const data = response.data?.data ?? response.data;
  const newAT = storeRefreshedTokens(data, rtToSend);
  if (typeof _authUpdater === "function") _authUpdater(data);
  return newAT;
}

async function runOnceLockHeld(tokenAtStart) {
  if (isBackoffActive()) {
    console.warn("[Auth] Lock held: global backoff active — aborting refresh.");
    throw Object.assign(
      new Error("Access token expired — refresh backoff active."),
      { _authBackoff: true },
    );
  }
  if (isRotatedByOtherTab(tokenAtStart)) {
    console.log(
      `[Auth] Lock held: another tab already rotated. RT:${mask(getRT())}`,
    );
    return getAT();
  }
  const rt = getRT();
  if (!rt) throw new Error("[Auth] Refresh token cleared before lock.");
  return doRefreshRequest(tokenAtStart);
}

async function runFallback(tokenAtStart) {
  const deadline = Date.now() + FALLBACK_TIMEOUT_MS;
  await sleep(jitter(0, 150));
  while (Date.now() < deadline) {
    if (isBackoffActive()) {
      console.warn(
        "[Auth] Fallback: global backoff active — aborting refresh.",
      );
      throw Object.assign(
        new Error("Access token expired — refresh backoff active."),
        { _authBackoff: true },
      );
    }
    if (isRotatedByOtherTab(tokenAtStart)) {
      console.log("[Auth] Fallback: another tab rotated — reusing.");
      return getAT();
    }
    if (isRemoteActive()) {
      await sleep(jitter(FALLBACK_POLL_MS, FALLBACK_POLL_MS));
      continue;
    }
    if (acquireClaim()) {
      broadcast({ type: "refresh-active", ts: Date.now() });
      try {
        return await runOnceLockHeld(tokenAtStart);
      } finally {
        releaseClaim();
        broadcast({ type: "refresh-done" });
      }
    }
    await sleep(jitter(FALLBACK_POLL_MS, FALLBACK_POLL_MS));
  }
  throw new Error("[Auth] Timed out on cross-tab refresh coordination.");
}

async function executeRefreshFlow() {
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const tokenAtStart = getRT();
    if (!tokenAtStart) {
      console.warn("[Auth] No refresh token — logging out.");
      clearTokens();
      dispatch("auth-failed");
      throw new Error("No refresh token.");
    }
    try {
      return await runCoordinatedRefresh(tokenAtStart);
    } catch (err) {
      if (err?._tokenRotatedStale) {
        if (attempt < MAX_RETRIES - 1) {
          console.log(
            `[Auth] State changed during refresh (attempt ${attempt + 1}/${MAX_RETRIES}) — re-entering flow.`,
          );
          continue;
        }
        throw new Error(
          "Refresh state could not stabilize after maximum retries.",
        );
      }
      err.failedRefreshToken = tokenAtStart;
      throw err;
    }
  }
  throw new Error("Refresh state could not stabilize after maximum retries.");
}

export function refreshAccessToken() {
  if (_refreshPromise) {
    console.log("[Auth] Deduped refresh — reusing in-flight promise.");
    return _refreshPromise;
  }
  _refreshPromise = executeRefreshFlow()
    .catch((err) => {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        const failedRefreshToken = err?.failedRefreshToken || getRT();
        const latestRefreshToken = getRT();
        const latestAccessToken = getAT();
        const latestExp = getExpiry();
        const atJwtExp = latestAccessToken
          ? decodeJwtExp(latestAccessToken)
          : null;
        const atValid =
          latestAccessToken &&
          (atJwtExp !== null
            ? atJwtExp * 1000 > Date.now()
            : latestExp !== null && latestExp > Date.now());
        const concurrentRotation =
          latestRefreshToken !== null &&
          latestRefreshToken !== failedRefreshToken &&
          latestAccessToken !== null &&
          atValid;
        if (concurrentRotation) {
          console.log(
            `[Auth] 401 concurrent rotation. failed:${mask(failedRefreshToken)} latest:${mask(latestRefreshToken)}`,
          );
          reconcileTimer();
          return latestAccessToken;
        }
        console.warn(
          `[Auth] 401 genuine invalid RT:${mask(failedRefreshToken)} tabId:${TAB_ID}. Logging out.`,
        );
        clearTokens();
        dispatch("auth-failed");
      } else if (!err?._authBackoff) {
        console.warn(
          `[Auth] Refresh error (status:${status ?? "network"}) — session preserved.`,
        );
      }
      throw err;
    })
    .finally(() => {
      _refreshPromise = null;
    });
  return _refreshPromise;
}

function isAuthUrl(url) {
  return (
    (url || "").includes("/auth/login") || (url || "").includes("/auth/refresh")
  );
}

function applyBearer(config, token) {
  if (!token) return config;
  if (typeof config.headers?.set === "function")
    config.headers.set("Authorization", `Bearer ${token}`);
  else
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  return config;
}

api.interceptors.request.use(
  async (config) => {
    if (!config._retry && !isAuthUrl(config.url) && isTokenNearExpiry()) {
      if (!canRefresh("requestInterceptor")) {
        if (isExpiredNow()) return rejectExpiredRequest();
        return applyBearer(config, getAT());
      }
      try {
        await refreshAccessToken();
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return applyBearer(config, getAT());
  },
  (e) => Promise.reject(e),
);

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const req = error.config;
    if (
      !req ||
      error.response?.status !== 401 ||
      req._retry ||
      isAuthUrl(req.url)
    )
      return Promise.reject(error);
    req._retry = true;
    if (!canRefresh("401Retry")) {
      if (isExpiredNow()) return rejectExpiredRequest();
      return api(applyBearer(req, getAT()));
    }
    try {
      const newAT = await refreshAccessToken();
      return api(applyBearer(req, newAT));
    } catch (e) {
      return Promise.reject(e);
    }
  },
);

function migrateLegacy() {
  if (!hasEnv() || localStorage.getItem(STORAGE_KEY)) return;
  const at = localStorage.getItem("token");
  const rt = localStorage.getItem("refreshToken");
  const exp = localStorage.getItem("expiresAt");
  if (!at && !rt && !exp) return;
  console.log("[Auth] Migrating legacy keys to authState.");
  commitState({
    accessToken: at || null,
    refreshToken: rt || null,
    expiresAt: exp ? Number(exp) : null,
  });
}

if (hasEnv()) {
  migrateLegacy();
  getChannel();
  startTokenAutoRefresh();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    const state = readState();
    if (!state?.accessToken || !state?.refreshToken || state.expiresAt == null)
      return;
    const exp = Number(state.expiresAt);
    if (Number.isNaN(exp)) return;
    console.log(
      `[Auth] Tab visible. Remaining: ${Math.round((exp - Date.now()) / 1000)}s`,
    );
    if (exp - Date.now() <= REFRESH_BUFFER_MS) {
      if (canRefresh("visibilityChange")) refreshAccessToken().catch(() => {});
    } else if (!_timer) {
      scheduleRefresh(exp);
    }
  });

  window.addEventListener("storage", ({ key, newValue }) => {
    if (key === STORAGE_KEY) {
      if (newValue === null) {
        clearLocalState();
        dispatch("auth-failed");
      } else reconcileTimer();
    }
    if (key === META_KEY && newValue !== null) {
      try {
        const meta = JSON.parse(newValue);
        if (meta?.backoffUntil && meta.backoffTabId !== TAB_ID) {
          console.warn(
            `[Auth] Cross-tab backoff from storage until ${new Date(meta.backoffUntil).toISOString()}`,
          );
        }
      } catch {}
    }
  });

  window.addEventListener("beforeunload", () => {
    releaseClaim();
    if (_channel) {
      _channel.close();
      _channel = null;
    }
  });
}

export default api;
