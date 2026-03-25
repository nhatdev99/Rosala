import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_SESSION_KEY = 'auth-session-v1';

export interface SavedAuthSession {
  email: string;
  password: string;
}

export async function saveAuthSession(session: SavedAuthSession) {
  await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export async function readAuthSession(): Promise<SavedAuthSession | null> {
  const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SavedAuthSession;
    if (!parsed?.email || !parsed?.password) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function clearAuthSession() {
  await AsyncStorage.removeItem(AUTH_SESSION_KEY);
}
