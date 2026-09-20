import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { authApi } from '@/modules/auth/api';
import { AuthHeading } from '@/modules/auth/components/AuthHeading';
import { isValidEmail, isValidPassword, validate } from '@/modules/auth/lib/validation';
import { KeyboardScreen } from '@/shared/components/KeyboardScreen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, TextField } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';

/**
 * Set a new password with the token from the reset email. Reached from the sheet, or via the
 * `quick-watch://reset-password?token=…&email=…` deep link the email can point to.
 */
export function ResetPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ email?: string; token?: string }>();

  const [email, setEmail] = useState(params.email ?? '');
  const [token, setToken] = useState(params.token ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    token?: string;
    password?: string;
    confirm?: string;
  }>({});

  const reset = useMutation({
    mutationFn: () => authApi.resetPassword(email.trim(), token.trim(), password),
    onSuccess: () => {
      toast.success('Password updated', 'Log in with your new password.');
      router.replace('/login');
    },
    onError: (e) => toast.error('Could not reset password', errorMessage(e)),
  });

  const submit = () => {
    const next = validate({
      email: isValidEmail(email) ? undefined : 'Enter a valid email address',
      token: token.trim() ? undefined : 'Paste the code from your email',
      password: isValidPassword(password) ? undefined : 'At least 6 characters',
      confirm: confirm === password ? undefined : 'Passwords do not match',
    });
    setErrors(next);
    if (Object.keys(next).length === 0) reset.mutate();
  };

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader />
      <KeyboardScreen
        footer={
          <Button onPress={submit} loading={reset.isPending}>
            Update password
          </Button>
        }>
        <AuthHeading
          title="Set a new password"
          subtitle="Paste the reset code from the email we sent you, then choose a new password."
        />
        <Box gap="m">
          <TextField
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField
            label="Reset code"
            icon="key-outline"
            placeholder="Paste the token from the email link"
            value={token}
            onChangeText={setToken}
            error={errors.token}
            autoCapitalize="none"
            autoCorrect={false}
            helper="The link looks like …/reset-password?token=CODE — copy the CODE part."
          />
          <TextField
            label="New password"
            icon="lock-closed-outline"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry={!show}
            trailingIcon={show ? 'eye-off-outline' : 'eye-outline'}
            trailingIconAccessibilityLabel={show ? 'Hide password' : 'Show password'}
            onTrailingIconPress={() => setShow((v) => !v)}
            autoCapitalize="none"
            autoComplete="off"
            textContentType="none"
          />
          <TextField
            label="Confirm password"
            icon="lock-closed-outline"
            placeholder="Repeat the new password"
            value={confirm}
            onChangeText={setConfirm}
            error={errors.confirm}
            secureTextEntry={!show}
            autoCapitalize="none"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
        </Box>
      </KeyboardScreen>
    </Box>
  );
}
