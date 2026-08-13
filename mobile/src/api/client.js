import axios from "axios";
import { API_URL } from "./config";
import { getSession, clearSession, SESSION_KEYS } from "./session";

// Shared 401 listeners: any 401 notifies all listeners, so the UI can
// redirect to login (same pattern as the web client).
const unauthorizedListeners = new Set();

export function onUnauthorized(fn) {
  unauthorizedListeners.add(fn);
  return () => {
    unauthorizedListeners.delete(fn);
  };
}

function notifyUnauthorized() {
  unauthorizedListeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // Listener errors must never break the request pipeline.
    }
  });
}

export function createClient(sessionKey) {
  const client = axios.create({
    baseURL: API_URL,
    timeout: 15000,
  });

  client.interceptors.request.use(async (config) => {
    const session = await getSession(sessionKey);
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await clearSession(sessionKey);
        notifyUnauthorized();
      }
      return Promise.reject(error);
    }
  );

  return client;
}

// Single API client for the whole app (all routes require auth).
export const apiClient = createClient(SESSION_KEYS.student);

// Server errors: err.response.data.message or .error (string), else
// network/timeout errors get a friendly message, else the fallback.
export const getErrorMessage = (
  err,
  fallback = "Terjadi kesalahan. Silakan coba lagi."
) => {
  const serverMessage = err?.response?.data?.message;
  const serverError = err?.response?.data?.error;
  if (typeof serverMessage === "string" && serverMessage) return serverMessage;
  if (typeof serverError === "string" && serverError) return serverError;
  if (!err?.response) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  }
  return fallback;
};
