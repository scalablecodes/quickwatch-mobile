import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'quickwatch.token';
const USER_KEY = 'quickwatch.user';
const BIOMETRIC_KEY = 'quickwatch.biometric';
const DEVICE_ID_KEY = 'quickwatch.deviceId';
const PUSH_TOKEN_KEY = 'quickwatch.pushToken';

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

/** Credential issued by `/users/register-biometric`, replayed on biometric sign-in. */
export type BiometricCredential = { email: string; deviceId: string; biometricToken: string };

export const biometricStorage = {
  get: async (): Promise<BiometricCredential | null> => {
    const raw = await secure.get(BIOMETRIC_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BiometricCredential;
    } catch {
      return null;
    }
  },
  set: (credential: BiometricCredential) => secure.set(BIOMETRIC_KEY, JSON.stringify(credential)),
  clear: () => secure.remove(BIOMETRIC_KEY),
};

/** Stable per-install id the API ties biometric devices to. */
export const deviceIdStorage = {
  get: () => secure.get(DEVICE_ID_KEY),
  set: (id: string) => secure.set(DEVICE_ID_KEY, id),
};

/** Last Expo push token registered with the API, so sign-out can remove it. */
export const pushTokenStorage = {
  get: () => AsyncStorage.getItem(PUSH_TOKEN_KEY),
  set: (token: string) => AsyncStorage.setItem(PUSH_TOKEN_KEY, token),
  clear: () => AsyncStorage.removeItem(PUSH_TOKEN_KEY),
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
