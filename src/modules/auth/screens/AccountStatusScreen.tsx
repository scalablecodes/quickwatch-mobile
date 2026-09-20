import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/modules/auth/session';
import type { AccountStatus } from '@/modules/auth/types';
import { Logo } from '@/shared/components/brand/Logo';
import { Box, Button, Text, type IoniconName } from '@/shared/components/ui';
import { useTheme, type ThemeColor } from '@/shared/theme';

const copy: Record<
  AccountStatus | 'unverified',
  { icon: IoniconName; tint: ThemeColor; bg: ThemeColor; title: string; body: string }
> = {
  unverified: {
    icon: 'mail-unread',
    tint: 'info',
    bg: 'infoSoft',
    title: 'Verify your email',
    body: 'Open the verification link we emailed you, then tap refresh below.',
  },
  pendingReview: {
    icon: 'hourglass',
    tint: 'warning',
    bg: 'warningSoft',
    title: 'Your profile is under review',
    body: 'Thanks for applying to be a QuickWatch sitter. Our team is checking your profile — we’ll email you as soon as it’s approved, usually within a day or two.',
  },
  Rejected: {
    icon: 'close-circle',
    tint: 'danger',
    bg: 'dangerSoft',
    title: 'Application not approved',
    body: 'We weren’t able to approve your sitter profile this time. Contact support if you think this is a mistake.',
  },
  Suspended: {
    icon: 'alert-circle',
    tint: 'danger',
    bg: 'dangerSoft',
    title: 'Account suspended',
    body: 'Your account has been suspended. Please reach out to support to resolve this.',
  },
  Active: {
    icon: 'checkmark-circle',
    tint: 'success',
    bg: 'successSoft',
    title: 'You’re all set',
    body: 'Your account is active.',
  },
};

/** Blocks the app for accounts that are not Active (sitters pending review, suspended, unverified). */
export function AccountStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user, refresh, signOut } = useSession();
  const [refreshing, setRefreshing] = useState(false);

  const key = user?.emailVerified === false ? 'unverified' : (user?.status ?? 'pendingReview');
  const c = copy[key];

  const check = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <Box
      flex={1}
      backgroundColor="screenBackground"
      paddingHorizontal="ml"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }}>
      <Logo size={36} wordmark />
      <Box flex={1} justifyContent="center" gap="l">
        <Animated.View entering={FadeInDown.springify().damping(14)}>
          <Box
            alignSelf="center"
            width={120}
            height={120}
            borderRadius="full"
            backgroundColor={c.bg}
            alignItems="center"
            justifyContent="center">
            <Ionicons name={c.icon} size={56} color={colors[c.tint]} />
          </Box>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <Box gap="s" alignItems="center">
            <Text variant="h1" textAlign="center">
              {c.title}
            </Text>
            <Text variant="p16" color="textSecondary" textAlign="center">
              {c.body}
            </Text>
            {user ? (
              <Text variant="p12" color="textMuted" textAlign="center">
                Signed in as {user.Email}
              </Text>
            ) : null}
          </Box>
        </Animated.View>
      </Box>
      <Animated.View entering={FadeInUp.delay(200).duration(450)}>
        <Box gap="sm">
          <Button icon="refresh" onPress={check} loading={refreshing}>
            Check again
          </Button>
          <Button
            variant="outline"
            icon="help-buoy-outline"
            onPress={() => router.push('/settings/support')}>
            Contact support
          </Button>
          <Button variant="ghost" onPress={() => signOut()}>
            Log out
          </Button>
        </Box>
      </Animated.View>
    </Box>
  );
}
