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
  const accessToken = tokenData?.accessToken;
  const refreshToken = tokenData?.refreshToken;
  const expiresAt = tokenData?.expiresAt;

  if (!accessToken) return;

  localStorage.setItem("token", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  if (expiresAt) {
    localStorage.setItem("expiresAt", expiresAt);
    scheduleAutoRefresh(expiresAt);
  }
}

export function scheduleAutoRefresh(expiresAt) {
  if (scheduledTimer) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }

  if (!expiresAt) return;

  const expiryTime = new Date(expiresAt).getTime();
  if (Number.isNaN(expiryTime)) return;

  const delay = Math.max(0, expiryTime - REFRESH_BUFFER_MS - Date.now());

  scheduledTimer = setTimeout(() => {
    refreshAccessToken().catch(() => {});
  }, delay);
}

export function startTokenAutoRefresh() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const expiresAt = localStorage.getItem("expiresAt");

  if (!token || !refreshToken || !expiresAt) return;

  const expiryTime = new Date(expiresAt).getTime();

  if (Date.now() >= expiryTime - REFRESH_BUFFER_MS) {
    refreshAccessToken().catch(() => {});
  } else {
    scheduleAutoRefresh(expiresAt);
  }
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
    .post("/api/auth/refresh", { refreshToken: storedRefreshToken })
    .then((response) => {
      const tokenData = response.data?.data ?? response.data;
      const newAccessToken = tokenData?.accessToken;

      if (!newAccessToken) throw new Error("No access token");

      saveTokens(tokenData);
      if (typeof _authUpdater === "function") _authUpdater(tokenData);

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
  (config) => {
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

export default api;
