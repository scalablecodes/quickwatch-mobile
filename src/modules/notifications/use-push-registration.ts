import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { pushTokenStorage } from '@/shared/lib/storage';

import { notificationsApi } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Ask for permission and register this device's Expo push token once the user is active. */
export function usePushRegistration(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !Device.isDevice || Platform.OS === 'web') return;
    let cancelled = false;
    (async () => {
      try {
        const { status: existing } = await Notifications.getPermissionsAsync();
        const { status } =
          existing === 'granted'
            ? { status: existing }
            : await Notifications.requestPermissionsAsync();
        if (status !== 'granted' || cancelled) return;
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }
        const { data: token } = await Notifications.getExpoPushTokenAsync();
        if (!cancelled && token) {
          await notificationsApi.registerDevice(token, Platform.OS);
          // Kept so sign-out can de-register this device.
          await pushTokenStorage.set(token);
        }
      } catch {
        // Push is best-effort; in-app notifications still work.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
