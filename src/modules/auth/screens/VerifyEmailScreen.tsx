import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authApi } from '@/modules/auth/api';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, Text } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { useTheme } from '@/shared/theme';

const RESEND_COOLDOWN = 45;

/** Shown after sign-up (and when login is refused for an unverified email). */
export function VerifyEmailScreen() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const {
    email = '',
    role,
    token,
  } = useLocalSearchParams<{ email?: string; role?: string; token?: string }>();
  const [cooldown, setCooldown] = useState(0);
  const [verified, setVerified] = useState(false);

  // Deep link from the verification email (quick-watch://verify-email?token=…&email=…).
  const verify = useMutation({
    mutationFn: () => authApi.verifyEmail(token as string, email),
    onSuccess: () => {
      setVerified(true);
      toast.success('Email verified', 'You can log in now.');
    },
    onError: (error) => toast.error('Verification failed', errorMessage(error)),
  });

  const canVerify = Boolean(token && email);
  useEffect(() => {
    if (canVerify && verify.isIdle) verify.mutate();
    // Runs once per deep link; `verify` is stable for the life of the screen.
  }, [canVerify, verify]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resend = useMutation({
    mutationFn: () => authApi.resendVerification(email),
    onSuccess: () => {
      setCooldown(RESEND_COOLDOWN);
      toast.success('Verification email sent', `Check ${email}`);
    },
    onError: (error) => toast.error('Could not resend', errorMessage(error)),
  });

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader />
      <Box
        flex={1}
        paddingHorizontal="ml"
        justifyContent="center"
        gap="l"
        style={{ paddingBottom: insets.bottom + 40 }}>
        <Animated.View entering={FadeInDown.springify().damping(14)}>
          <Box
            alignSelf="center"
            width={120}
            height={120}
            borderRadius="full"
            backgroundColor="primarySoft"
            alignItems="center"
            justifyContent="center">
            <Ionicons name="mail-open" size={52} color={colors.primary} />
            <Box
              position="absolute"
              bottom={4}
              right={4}
              width={34}
              height={34}
              borderRadius="full"
              backgroundColor="accent"
              alignItems="center"
              justifyContent="center"
              borderWidth={3}
              borderColor="screenBackground">
              <Ionicons name="checkmark" size={18} color={colors.onAccent} />
            </Box>
          </Box>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <Box gap="s" alignItems="center">
            <Text variant="h1" textAlign="center">
              {verified ? 'Email verified' : verify.isPending ? 'Verifying…' : 'Check your inbox'}
            </Text>
            <Text variant="p16" color="textSecondary" textAlign="center">
              {verified ? 'Your address is confirmed:' : 'We sent a verification link to'}
              {'\n'}
              <Text variant="p16SemiBold">{email}</Text>
            </Text>
            <Text variant="p14" color="textMuted" textAlign="center">
              {verified
                ? 'Your account is active.'
                : 'Open it to activate your account, then come back and log in.'}
              {role === 'Babysitter'
                ? ' Sitter profiles are also reviewed by our team before bookings open up.'
                : ''}
            </Text>
          </Box>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(200).duration(450)}>
          <Box gap="sm">
            <Button onPress={() => router.replace('/login')}>I&apos;ve verified — log in</Button>
            <Button
              variant="ghost"
              loading={resend.isPending}
              disabled={cooldown > 0 || !email}
              onPress={() => resend.mutate()}>
              {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend email'}
            </Button>
          </Box>
        </Animated.View>
      </Box>
    </Box>
  );
}
