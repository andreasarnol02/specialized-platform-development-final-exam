import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiClient, onUnauthorized } from "../api/client";
import {
  SESSION_KEYS,
  getSession,
  saveSession,
  clearSession,
} from "../api/session";

// Student auth session for My Skill, backed by SecureStore.
// The whole app is gated: no token -> Login/Register stack; token -> main stack.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  const logout = useCallback(() => {
    clearSession(SESSION_KEYS.student);
    setUser(null);
    setToken(null);
  }, []);

  const boot = useCallback(async () => {
    try {
      const session = await getSession(SESSION_KEYS.student);
      if (session?.token) {
        setToken(session.token);
        setUser(session.user);
      }
    } finally {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    boot();
  }, [boot]);

  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      logout();
    });
    return unsubscribe;
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    const payload = data?.data ?? data;
    const nextUser = { ...payload.user, role: payload.user?.role || "student" };
    saveSession(SESSION_KEYS.student, { token: payload.token, user: nextUser });
    setToken(payload.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payloadBody) => {
    const { data } = await apiClient.post("/auth/register", payloadBody);
    const payload = data?.data ?? data;
    const nextUser = { ...payload.user, role: payload.user?.role || "student" };
    saveSession(SESSION_KEYS.student, { token: payload.token, user: nextUser });
    setToken(payload.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await apiClient.get("/auth/me");
    const fresh = data?.data ?? data;
    const next = { ...(user || {}), ...fresh };
    setUser(next);
    if (token) {
      saveSession(SESSION_KEYS.student, { token, user: next });
    }
    return fresh;
  }, [user, token]);

  const value = {
    user,
    token,
    booting,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
