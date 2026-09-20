import { Stack } from 'expo-router';

import { theme } from '@/shared/theme';

const sheet = {
  presentation: 'formSheet',
  sheetAllowedDetents: 'fitToContents',
  sheetGrabberVisible: true,
  sheetCornerRadius: theme.borderRadii.sheet,
} as const;

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="review" options={sheet} />
    </Stack>
  );
}
