import { Stack } from 'expo-router';

import { theme } from '@/shared/theme';

const sheet = {
  presentation: 'formSheet',
  sheetAllowedDetents: 'fitToContents',
  sheetGrabberVisible: true,
  sheetCornerRadius: theme.borderRadii.sheet,
} as const;

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="payouts" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="support" />
      <Stack.Screen name="switch-role" options={sheet} />
      <Stack.Screen name="biometric" options={sheet} />
    </Stack>
  );
}
