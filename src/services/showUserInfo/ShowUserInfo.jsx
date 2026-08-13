import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  clearTokens,
  saveTokens,
  scheduleAutoRefresh,
  setAuthUpdater,
  startTokenAutoRefresh,
} from "../../http-common";
import { customerLoginApi, showUserData } from "../loginservice/LoginServices";

const AuthContext = createContext(null);

export const AUTH_STATUS = {
  INITIALIZING: "initializing",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(AUTH_STATUS.INITIALIZING);

  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const fetchAndSetUser = useCallback(async () => {
    try {
      const res = await showUserData();
      const userData = res?.data?.data ?? res?.data ?? null;
      setUser(userData);
      setStatus(AUTH_STATUS.AUTHENTICATED);
      return userData;
    } catch {
      clearTokens();
      setUser(null);
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
      return;
    }

    startTokenAutoRefresh();
    fetchAndSetUser();
  }, []);

  useEffect(() => {
    if (status !== AUTH_STATUS.AUTHENTICATED) return;

    const expiresAt = localStorage.getItem("expiresAt");
    if (expiresAt) {
      scheduleAutoRefresh(expiresAt);
    }

    setAuthUpdater((newTokenData) => {
      if (newTokenData?.expiresAt) {
        scheduleAutoRefresh(newTokenData.expiresAt);
      }
    });

    return () => {
      setAuthUpdater(null);
    };
  }, [status]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
        navigateRef.current("/", { replace: true });
      }

      if (e.key === "token" && e.newValue && !e.oldValue) {
        fetchAndSetUser();
      }
    };

    const handleAuthFailed = () => {
      setUser(null);
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
      navigateRef.current("/", { replace: true });
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-failed", handleAuthFailed);
    window.addEventListener("auth:logout", handleAuthFailed);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-failed", handleAuthFailed);
      window.removeEventListener("auth:logout", handleAuthFailed);
    };
  }, [fetchAndSetUser]);

  const login = useCallback(
    async (credentials) => {
      const data = await customerLoginApi(credentials);

      // --- Invite-code flow: API returns { data: { invitationId }, success: true }
      //     There is NO accessToken in this response — just return the invite data.
      if (credentials._inviteMode) {
        const inviteData = data?.data ?? data;
        return { tokenData: inviteData, userData: null };
      }

      // --- Normal password login: API must return an accessToken ---
      const tokenData =
        data?.data?.accessToken ? data.data :
        data?.accessToken       ? data      :
        data?.data              ? data.data :
        data;

      if (!tokenData?.accessToken) {
        throw new Error(
          data?.message || "Login failed: no access token returned by the server."
        );
      }

      saveTokens(tokenData);

      const userData = await fetchAndSetUser();

      if (userData) {
        const role = userData?.role;
        if (role === 'Admin' || role === 'SuperAdmin') {
          navigateRef.current('/admin', { replace: true });
        } else {
          navigateRef.current('/concierge', { replace: true });
        }
      }

      return { tokenData, userData };
    },
    [fetchAndSetUser],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
    window.dispatchEvent(new Event("auth:logout"));
    navigateRef.current("/", { replace: true });
  }, []);

  const refreshUser = useCallback(() => {
    return fetchAndSetUser();
  }, [fetchAndSetUser]);

  const value = {
    user,
    userInfo: user,
    status,
    loading: status === AUTH_STATUS.INITIALIZING,
    isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
    login,
    logout,
    refreshUser,
    setUser,
    setUserInfo: setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <UserProvider>");
  }
  return ctx;
};

export const useUser = () => useAuth();
