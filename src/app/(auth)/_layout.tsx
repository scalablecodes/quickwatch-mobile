import { Stack } from 'expo-router';

import { theme } from '@/shared/theme';

/** Native bottom sheet sized to its content (24pt corners, grabber). */
const sheet = {
  presentation: 'formSheet',
  sheetAllowedDetents: 'fitToContents',
  sheetGrabberVisible: true,
  sheetCornerRadius: theme.borderRadii.sheet,
} as const;

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="forgot-password" options={sheet} />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
