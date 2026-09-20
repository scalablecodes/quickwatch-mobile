import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'quickwatch.token';
const USER_KEY = 'quickwatch.user';

// SecureStore is unavailable on web; fall back to AsyncStorage there.
const secure = {
  get: (key: string) =>
    Platform.OS === 'web' ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key),
  set: (key: string, value: string) =>
    Platform.OS === 'web' ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value),
  remove: (key: string) =>
    Platform.OS === 'web' ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key),
};

/** Persisted auth token (secure on native). */
export const tokenStorage = {
  get: () => secure.get(TOKEN_KEY),
  set: (token: string) => secure.set(TOKEN_KEY, token),
  clear: () => secure.remove(TOKEN_KEY),
};

/** Cached profile so the app can render the right dashboard before `/users/me` answers. */
export const userStorage = {
  get: async <T>(): Promise<T | null> => {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  set: (user: unknown) => AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => AsyncStorage.removeItem(USER_KEY),
};
