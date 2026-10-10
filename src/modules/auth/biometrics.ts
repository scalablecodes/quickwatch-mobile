import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

import { biometricStorage, deviceIdStorage, type BiometricCredential } from '@/shared/lib/storage';

import { authApi } from './api';

export type BiometricKind = 'face' | 'fingerprint' | 'iris' | 'none';

/** Stable id for this install; the API registers biometric devices against it. */
export async function getDeviceId(): Promise<string> {
  const existing = await deviceIdStorage.get();
  if (existing) return existing;
  const id = Crypto.randomUUID();
  await deviceIdStorage.set(id);
  return id;
}

/** Which sensor this device offers, and whether the user has enrolled in it. */
export async function getBiometricKind(): Promise<BiometricKind> {
  if (Platform.OS === 'web') return 'none';
  const [hasHardware, isEnrolled, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);
  if (!hasHardware || !isEnrolled) return 'none';
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'face';
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return 'iris';
  return 'fingerprint';
}

/** Human label for the sensor, used in buttons and settings copy. */
export function biometricLabel(kind: BiometricKind): string {
  if (kind === 'face') return Platform.OS === 'ios' ? 'Face ID' : 'face unlock';
  if (kind === 'iris') return 'iris unlock';
  if (kind === 'fingerprint') return Platform.OS === 'ios' ? 'Touch ID' : 'fingerprint';
  return 'biometrics';
}

/** Prompts the OS sensor. Returns false when the user cancels or it fails. */
export async function promptBiometric(reason: string): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
  });
  return result.success;
}

export const getStoredCredential = () => biometricStorage.get();
export const clearStoredCredential = () => biometricStorage.clear();

/**
 * Enables biometric sign-in: confirms the sensor, exchanges the password for a device
 * token, and stores that token securely. The password is never persisted.
 */
export async function enableBiometricLogin(email: string, password: string): Promise<BiometricCredential> {
  const kind = await getBiometricKind();
  if (kind === 'none') throw new Error('This device has no enrolled biometrics.');
  const confirmed = await promptBiometric(`Enable ${biometricLabel(kind)} sign-in`);
  if (!confirmed) throw new Error('Biometric check was cancelled.');

  const deviceId = await getDeviceId();
  const { biometricToken } = await authApi.registerBiometric({
    Email: email,
    Password: password,
    deviceId,
    deviceName: Device.deviceName ?? Device.modelName ?? 'Unknown device',
  });
  const credential: BiometricCredential = { email, deviceId, biometricToken };
  await biometricStorage.set(credential);
  return credential;
}
