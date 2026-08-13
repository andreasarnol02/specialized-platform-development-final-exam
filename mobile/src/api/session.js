import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Single student session key (My Skill is a student-only app).
export const SESSION_KEYS = {
  student: "ms_student_session",
};

// On web, expo-secure-store is unavailable — fall back to localStorage.
const isWeb = Platform.OS === "web";

const webGet = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const webSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full / private mode — ignore.
  }
};

const webClear = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to recover — best effort.
  }
};

// All helpers are async and swallow SecureStore errors (return null on failure).
export async function getSession(key) {
  if (isWeb) return webGet(key);
  try {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveSession(key, { token, user }) {
  if (isWeb) return webSet(key, { token, user });
  try {
    await SecureStore.setItemAsync(key, JSON.stringify({ token, user }));
  } catch {
    // SecureStore may throw (e.g. keychain issues) — session still runs in-memory.
  }
}

export async function clearSession(key) {
  if (isWeb) return webClear(key);
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Nothing to recover — best effort.
  }
}
