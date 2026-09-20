import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SessionProvider, useSession } from '@/modules/auth/session';
import { usePushRegistration } from '@/modules/notifications/use-push-registration';
import { PaymentsProvider } from '@/shared/components/PaymentsProvider';
import { SplashOverlay } from '@/shared/components/SplashOverlay';
import { ToastProvider } from '@/shared/components/Toast';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { darkTheme, fontAssets, theme } from '@/shared/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

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
                  <StatusBar style={isDark ? 'light' : 'dark'} />
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
  usePushRegistration(signedIn && active);

  return (
    <Stack screenOptions={{ headerShown: false }}>
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
