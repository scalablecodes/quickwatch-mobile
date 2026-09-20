import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authApi } from '@/modules/auth/api';
import { isValidEmail } from '@/modules/auth/lib/validation';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, Text, TextField } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';

/** Bottom sheet: request a password reset email. */
export function ForgotPasswordSheet() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();

  const send = useMutation({
    mutationFn: () => authApi.forgotPassword(email.trim()),
    onSuccess: () => {
      toast.success('Reset email sent', 'If that address has an account, a link is on its way.');
      router.replace({ pathname: '/reset-password', params: { email: email.trim() } });
    },
    onError: (e) => toast.error('Could not send reset email', errorMessage(e)),
  });

  const submit = () => {
    if (!isValidEmail(email)) return setError('Enter a valid email address');
    setError(undefined);
    send.mutate();
  };

  return (
    <Box
      backgroundColor="cardBackground"
      padding="ml"
      gap="m"
      style={{ paddingBottom: insets.bottom + 20 }}>
      <Box gap="xs">
        <Text variant="h2">Forgot your password?</Text>
        <Text variant="p14" color="textSecondary">
          Enter your email and we&apos;ll send a reset link. It expires in one hour.
        </Text>
      </Box>
      <TextField
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setError(undefined);
        }}
        error={error}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="send"
        onSubmitEditing={submit}
      />
      <Button onPress={submit} loading={send.isPending}>
        Send reset link
      </Button>
    </Box>
  );
}
