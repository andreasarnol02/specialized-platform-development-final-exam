import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router";
import client, { getSession, saveSession, clearSession } from "../api/client";

const AuthContext = createContext(null);

// Normalize the API response shape { success, message, data: { token, user } }.
const extractAuth = (payload) => {
  const data = payload?.data ?? payload;
  return {
    token: data?.token ?? payload?.token,
    user: data?.user ?? data,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const session = getSession();
    if (session?.token) {
      setToken(session.token);
      setUser(session.user || null);
    }
    setBooting(false);
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setToken(null);
      if (window.location.pathname !== "/login") {
        navigate("/login");
      }
    };
    window.addEventListener("myskill:unauthorized", onUnauthorized);
    return () =>
      window.removeEventListener("myskill:unauthorized", onUnauthorized);
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    const { token: nextToken, user: nextUser } = extractAuth(data);
    saveSession(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await client.post("/auth/register", payload);
    const { token: nextToken, user: nextUser } = extractAuth(data);
    saveSession(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await client.get("/auth/me");
    const payload = data?.data ?? data;
    const fresh = payload?.user ?? payload;
    setUser((prev) => {
      const next = { ...prev, ...fresh };
      saveSession(token, next);
      return next;
    });
    return fresh;
  }, [token]);

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
  return useContext(AuthContext);
}
