import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  biometricLabel,
  clearStoredCredential,
  enableBiometricLogin,
  getBiometricKind,
  getStoredCredential,
  type BiometricKind,
} from '@/modules/auth/biometrics';
import { useSession } from '@/modules/auth/session';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, Text, TextField } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { useTheme } from '@/shared/theme';

/**
 * Bottom sheet to turn biometric sign-in on or off. Enabling re-checks the password,
 * because the API exchanges it for the device token that replaces it at sign-in.
 */
export function BiometricSheet() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useSession();

  const [kind, setKind] = useState<BiometricKind>('none');
  const [enabled, setEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [sensor, credential] = await Promise.all([getBiometricKind(), getStoredCredential()]);
      if (cancelled) return;
      setKind(sensor);
      setEnabled(Boolean(credential));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const label = biometricLabel(kind);

  const enable = useMutation({
    mutationFn: () => enableBiometricLogin(user?.Email ?? '', password),
    onSuccess: () => {
      toast.success(`${label} sign-in enabled`, 'Use it next time you log in.');
      router.back();
    },
    onError: (e) => toast.error('Could not enable', errorMessage(e)),
  });

  const disable = useMutation({
    mutationFn: () => clearStoredCredential(),
    onSuccess: () => {
      setEnabled(false);
      toast.info(`${label} sign-in turned off`);
      router.back();
    },
  });

  const submit = () => {
    if (!password) return setError('Enter your password to confirm');
    setError(undefined);
    enable.mutate();
  };

  return (
    <Box
      backgroundColor="cardBackground"
      padding="ml"
      gap="m"
      style={{ paddingBottom: insets.bottom + 20 }}>
      <Box flexDirection="row" alignItems="center" gap="sm">
        <Box
          width={48}
          height={48}
          borderRadius="l"
          backgroundColor="primarySoft"
          alignItems="center"
          justifyContent="center">
          <Ionicons
            name={kind === 'face' ? 'scan-outline' : 'finger-print-outline'}
            size={24}
            color={colors.primary}
          />
        </Box>
        <Box flex={1} gap="xxs">
          <Text variant="h2">{enabled ? `${label} sign-in` : `Enable ${label}`}</Text>
          <Text variant="p14" color="textSecondary">
            {kind === 'none'
              ? 'This device has no fingerprint or face enrolled. Add one in your device settings first.'
              : enabled
                ? `You can sign in with ${label} on this device.`
                : `Skip typing your password — sign in with ${label} on this device.`}
          </Text>
        </Box>
      </Box>

      {kind === 'none' ? (
        <Button variant="outline" onPress={() => router.back()}>
          Close
        </Button>
      ) : enabled ? (
        <Button variant="danger" loading={disable.isPending} onPress={() => disable.mutate()}>
          Turn off on this device
        </Button>
      ) : (
        <>
          <TextField
            label="Confirm your password"
            icon="lock-closed-outline"
            placeholder="Your password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setError(undefined);
            }}
            error={error}
            secureTextEntry={!show}
            trailingIcon={show ? 'eye-off-outline' : 'eye-outline'}
            trailingIconAccessibilityLabel={show ? 'Hide password' : 'Show password'}
            onTrailingIconPress={() => setShow((v) => !v)}
            autoCapitalize="none"
            autoComplete="current-password"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          <Button onPress={submit} loading={enable.isPending}>
            {`Enable ${label}`}
          </Button>
        </>
      )}
    </Box>
  );
}
