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

/* -------------------------------------------------------------------------
 * Expiry parsing
 * ---------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------
 * Token storage
 * ---------------------------------------------------------------------- */

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
}

export function saveTokens(tokenData) {
  if (!tokenData) return;

  const accessToken =
    tokenData?.accessToken ||
    tokenData?.token ||
    tokenData?.access_token ||
    tokenData?.jwt;

  const refreshToken = tokenData?.refreshToken || tokenData?.refresh_token;

  const expiryMs = resolveExpiry(tokenData, accessToken);

  if (accessToken) {
    setStored("token", accessToken);
  }

  if (refreshToken) {
    setStored("refreshToken", refreshToken);
  }

  if (!Number.isNaN(expiryMs)) {
    const isoString = new Date(expiryMs).toISOString();
    setStored("expiresAt", isoString);
    scheduleAutoRefresh(isoString);
  } else {
    console.warn("[Auth] Could not determine token expiry — auto-refresh will not be scheduled.");
  }
}

/* -------------------------------------------------------------------------
 * Scheduling
 * ---------------------------------------------------------------------- */

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

  console.log(
    `[Auth] Token expires at: ${new Date(expiryTime).toISOString()} | ` +
    `Time remaining: ${Math.round(timeRemaining / 1000)}s`
  );

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
  console.log(
    `[Auth] Refresh scheduled for ${scheduledFor} ` +
    `(${Math.round(safeDelay / 1000)}s from now, ${REFRESH_BUFFER_MS / 1000}s before expiry)`
  );

  scheduledTimer = setTimeout(() => {
    console.log("[Auth] Scheduled refresh firing now.");
    refreshAccessToken().catch(() => {});
  }, safeDelay);
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
      const newAccessToken =
        tokenData?.accessToken ||
        tokenData?.token ||
        tokenData?.access_token ||
        tokenData?.jwt;

      if (!newAccessToken) {
        throw new Error("No access token returned from refresh endpoint.");
      }

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


api.interceptors.request.use(
  async (config) => {
    const url = config.url || "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

    if (!config._retry && !isAuthEndpoint && isTokenNearExpiry()) {
      try {
        await refreshAccessToken();
      } catch (error) {
        return Promise.reject(error);
      }
    }

    const token = getStored("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

if (hasWindow()) {
  startTokenAutoRefresh();
}

export default api;