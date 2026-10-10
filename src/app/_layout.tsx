import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SessionProvider, useSession } from '@/modules/auth/session';
import { usePushRegistration } from '@/modules/notifications/use-push-registration';
import { PaymentsProvider } from '@/shared/components/PaymentsProvider';
import { SplashOverlay } from '@/shared/components/SplashOverlay';
import { ToastProvider } from '@/shared/components/Toast';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { queryClient } from '@/shared/lib/query-client';
import { darkTheme, fontAssets, theme } from '@/shared/theme';

/**
 * Native bottom sheet sized to its content. These live on the root stack, not inside
 * `settings/`: a sheet presented as the first route of a nested stack has nothing behind
 * it, so iOS falls back to a full-screen card.
 */
const sheetOptions = {
  presentation: 'formSheet',
  sheetAllowedDetents: 'fitToContents',
  sheetGrabberVisible: true,
  sheetCornerRadius: theme.borderRadii.sheet,
} as const;

// Reactotron attaches to the query cache and network; development builds only, so it is
// required lazily rather than imported (keeps it out of release bundles).
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@/shared/lib/reactotron');
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';
  const restyleTheme = isDark ? darkTheme : theme;
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  // Keep the native splash up until the font is available (or failed, so we fall back to system).
  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RestyleThemeProvider theme={restyleTheme}>
          <ThemeProvider
            value={{
              ...navigationTheme,
              colors: {
                ...navigationTheme.colors,
                primary: restyleTheme.colors.primary,
                background: restyleTheme.colors.screenBackground,
                card: restyleTheme.colors.cardBackground,
                text: restyleTheme.colors.text,
                border: restyleTheme.colors.border,
              },
            }}>
            <PaymentsProvider>
              <SessionProvider>
                <ToastProvider>
                  <Root />
                </ToastProvider>
              </SessionProvider>
            </PaymentsProvider>
          </ThemeProvider>
        </RestyleThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function Root() {
  const { ready } = useSession();
  return (
    <>
      <SplashOverlay ready={ready} />
      {ready ? <RootStack /> : null}
    </>
  );
}

/**
 * Signed-out users only ever see the auth flow. Accounts that are not yet Active
 * (babysitters pending review, suspended) land on the status screen.
 */
function RootStack() {
  const { signedIn, active } = useSession();
  const isDark = useColorScheme() === 'dark';
  usePushRegistration(signedIn && active);

  // Status bar style is per screen (UIViewControllerBasedStatusBarAppearance); default to the scheme.
  return (
    <Stack screenOptions={{ headerShown: false, statusBarStyle: isDark ? 'light' : 'dark' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="terms" />
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !active}>
        <Stack.Screen name="account-status" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="settings" />
        <Stack.Screen name="switch-role" options={sheetOptions} />
        <Stack.Screen name="biometric" options={sheetOptions} />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && active}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sitter" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="notifications" />
      </Stack.Protected>
    </Stack>
  );
}
