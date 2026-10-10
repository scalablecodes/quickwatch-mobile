import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, type TextInput } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { authApi } from '@/modules/auth/api';
import {
  biometricLabel,
  clearStoredCredential,
  getBiometricKind,
  getStoredCredential,
  promptBiometric,
  type BiometricKind,
} from '@/modules/auth/biometrics';
import { AuthHeading } from '@/modules/auth/components/AuthHeading';
import { isValidEmail, validate } from '@/modules/auth/lib/validation';
import { useSession } from '@/modules/auth/session';
import { KeyboardScreen } from '@/shared/components/KeyboardScreen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, Text, TextField } from '@/shared/components/ui';
import { ApiError, errorMessage } from '@/shared/lib/api';
import type { BiometricCredential } from '@/shared/lib/storage';

const STAGGER = 70;

export function LoginScreen() {
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useSession();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [biometric, setBiometric] = useState<{
    kind: BiometricKind;
    credential: BiometricCredential;
  } | null>(null);

  // Offer biometric sign-in only when this device has an enrolled sensor and a stored credential.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [kind, credential] = await Promise.all([getBiometricKind(), getStoredCredential()]);
      if (!cancelled && kind !== 'none' && credential) setBiometric({ kind, credential });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const biometricLogin = useMutation({
    mutationFn: async () => {
      if (!biometric) return null;
      const ok = await promptBiometric(`Sign in with ${biometricLabel(biometric.kind)}`);
      if (!ok) return null;
      const { email: storedEmail, deviceId, biometricToken } = biometric.credential;
      return authApi.loginBiometric({ Email: storedEmail, deviceId, biometricToken });
    },
    onSuccess: async (data) => {
      if (!data) return;
      await signIn(data.token, data.user);
      router.replace('/');
    },
    onError: async (error) => {
      // A stale token (password changed, device removed server-side) can never succeed again.
      if (error instanceof ApiError && error.status === 401) {
        await clearStoredCredential();
        setBiometric(null);
        toast.error('Biometric sign-in expired', 'Please sign in with your password again.');
        return;
      }
      toast.error('Could not sign in', errorMessage(error));
    },
  });

  const login = useMutation({
    mutationFn: () => authApi.login(email.trim(), password),
    onSuccess: async ({ token, user }) => {
      await signIn(token, user);
      router.replace('/');
    },
    onError: (error) => {
      if (error instanceof ApiError && error.requiresEmailVerification) {
        router.push({ pathname: '/verify-email', params: { email: email.trim() } });
        return;
      }
      toast.error('Could not sign in', errorMessage(error));
    },
  });

  const submit = () => {
    const next = validate({
      email: isValidEmail(email) ? undefined : 'Enter a valid email address',
      password: password ? undefined : 'Enter your password',
    });
    setErrors(next);
    if (Object.keys(next).length === 0) login.mutate();
  };

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader />
      <KeyboardScreen
        footer={
          <Box gap="sm">
            <Button onPress={submit} loading={login.isPending}>
              Log in
            </Button>
            {biometric ? (
              <Button
                variant="outline"
                icon={biometric.kind === 'face' ? 'scan-outline' : 'finger-print-outline'}
                loading={biometricLogin.isPending}
                onPress={() => biometricLogin.mutate()}>
                {`Sign in with ${biometricLabel(biometric.kind)}`}
              </Button>
            ) : null}
          </Box>
        }>
        <AuthHeading title="Welcome back" subtitle="Log in to manage your bookings and messages." />

        <Box gap="m" marginTop="s">
          <Animated.View entering={FadeInUp.delay(STAGGER).duration(450)}>
            <TextField
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              error={errors.email}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(STAGGER * 2).duration(450)}>
            <TextField
              ref={passwordRef}
              label="Password"
              icon="lock-closed-outline"
              trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              trailingIconAccessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              onTrailingIconPress={() => setShowPassword((v) => !v)}
              placeholder="Your password"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={submit}
            />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(STAGGER * 3).duration(450)}>
            <Pressable
              accessibilityRole="link"
              hitSlop={8}
              onPress={() => router.push('/forgot-password')}
              style={styles.forgot}>
              <Text variant="link">Forgot password?</Text>
            </Pressable>
          </Animated.View>
        </Box>

        <Animated.View entering={FadeInUp.delay(STAGGER * 4).duration(450)}>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.replace('/welcome')}
            style={styles.switch}>
            <Text variant="p14" color="textSecondary">
              New to QuickWatch?{' '}
              <Text variant="p14SemiBold" color="primary">
                Create an account
              </Text>
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardScreen>
    </Box>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', marginTop: -4 },
  switch: { alignSelf: 'center', paddingVertical: 8 },
});
