import axios from "axios";

const BASE_URL = "https://ayurmitra.in/opulenza_reserve";
const REFRESH_BUFFER_MS = 300000;

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

function parseExpiresAt(expiresAt) {
  if (expiresAt === null || expiresAt === undefined || expiresAt === "") {
    return NaN;
  }

  if (typeof expiresAt === "number") {
    if (Number.isNaN(expiresAt)) return NaN;
    if (expiresAt < 1e11) {
      return Date.now() + expiresAt * 1000;
    }
    return expiresAt;
  }

  const str = String(expiresAt).trim();

  if (/^\d+$/.test(str)) {
    const num = Number(str);
    if (Number.isNaN(num)) return NaN;
    if (num < 1e11) {
      return Date.now() + num * 1000;
    }
    return num;
  }

  const normalized = str.replace(/(\.\d{3})\d+/, "$1");
  let t = new Date(normalized).getTime();
  if (!Number.isNaN(t)) return t;

  t = new Date(str).getTime();
  if (!Number.isNaN(t)) return t;

  return NaN;
}

export function setAuthUpdater(fn) {
  _authUpdater = fn;
}

export function clearTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresAt");
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

  const refreshToken =
    tokenData?.refreshToken ||
    tokenData?.refresh_token;

  let expiresAt =
    tokenData?.expiresAt ||
    tokenData?.expires_at ||
    tokenData?.expiration;

  if (!expiresAt && (tokenData?.expiresIn || tokenData?.expires_in)) {
    const expiresIn = Number(tokenData.expiresIn || tokenData.expires_in);
    if (!Number.isNaN(expiresIn)) {
      expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
    }
  }

  if (accessToken) {
    localStorage.setItem("token", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (expiresAt !== undefined && expiresAt !== null) {
    const parsedTime = parseExpiresAt(expiresAt);
    if (!Number.isNaN(parsedTime)) {
      const isoString = new Date(parsedTime).toISOString();
      localStorage.setItem("expiresAt", isoString);
      scheduleAutoRefresh(isoString);
    }
  }
}

export function scheduleAutoRefresh(expiresAt) {
  if (scheduledTimer) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }

  if (!expiresAt) return;

  const expiryTime = parseExpiresAt(expiresAt);
  if (Number.isNaN(expiryTime)) return;

  const now = Date.now();
  const timeRemaining = expiryTime - now;

  if (timeRemaining <= 0) {
    refreshAccessToken().catch(() => {});
    return;
  }

  const buffer = Math.min(REFRESH_BUFFER_MS, Math.max(10000, timeRemaining * 0.2));
  const delay = Math.max(0, timeRemaining - buffer);
  const safeDelay = Math.min(delay, 2147483647);

  scheduledTimer = setTimeout(() => {
    refreshAccessToken().catch(() => {});
  }, safeDelay);
}

export function startTokenAutoRefresh() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const expiresAt = localStorage.getItem("expiresAt");

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
  const expiresAt = localStorage.getItem("expiresAt");
  if (!expiresAt) return false;

  const expiryTime = parseExpiresAt(expiresAt);
  if (Number.isNaN(expiryTime)) return false;

  const now = Date.now();
  const timeRemaining = expiryTime - now;
  const buffer = Math.min(REFRESH_BUFFER_MS, Math.max(10000, timeRemaining * 0.2));

  return now >= expiryTime - buffer;
}

export function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const storedRefreshToken = localStorage.getItem("refreshToken");
  if (!storedRefreshToken) {
    clearTokens();
    window.dispatchEvent(new Event("auth-failed"));
    return Promise.reject(new Error("No refresh token available"));
  }

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
      if (typeof _authUpdater === "function") {
        _authUpdater(tokenData);
      }

      return newAccessToken;
    })
    .catch((error) => {
      clearTokens();
      window.dispatchEvent(new Event("auth-failed"));
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

    const token = localStorage.getItem("token");
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

if (typeof window !== "undefined") {
  startTokenAutoRefresh();
}

export default api;
