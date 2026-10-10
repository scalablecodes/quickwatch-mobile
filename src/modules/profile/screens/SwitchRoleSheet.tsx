import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authApi } from '@/modules/auth/api';
import { useSession } from '@/modules/auth/session';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, Text, TextField } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { useTheme } from '@/shared/theme';

/** Bottom sheet: switch dashboards, or onboard the account for its second role. */
export function SwitchRoleSheet() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { user, signIn } = useSession();
  const [rate, setRate] = useState(user?.hourlyRate ? String(user.hourlyRate) : '');

  const target = user?.role === 'Mother' ? 'Babysitter' : 'Mother';
  const onboarded = (user?.roles ?? [user?.role]).includes(target);
  const label = target === 'Mother' ? 'parent' : 'babysitter';

  const switchRole = useMutation({
    mutationFn: () =>
      onboarded
        ? authApi.switchRole(target)
        : authApi.onboardRole(target, target === 'Babysitter' ? Number(rate) : undefined),
    onSuccess: async ({ token, user: next }) => {
      await signIn(token, next);
      queryClient.clear();

      // The API can answer 200 "Dashboard switched" while still returning the old role,
      // so trust the returned user rather than the message before claiming success.
      if (next.role !== target) {
        toast.error(
          'Switch did not take effect',
          `The server kept this account in ${next.role === 'Mother' ? 'parent' : 'babysitter'} mode. Please try again later.`
        );
        router.back();
        return;
      }

      toast.success(
        onboarded
          ? `Switched to ${label} mode`
          : `${target === 'Mother' ? 'Parent' : 'Babysitter'} role added`,
        next.status !== 'Active'
          ? 'Your sitter profile will be reviewed before you can accept bookings.'
          : undefined
      );
      router.dismissAll();
      router.replace('/');
    },
    onError: (e) => toast.error('Could not switch', errorMessage(e)),
  });

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
            name={target === 'Mother' ? 'people' : 'heart'}
            size={24}
            color={colors.primary}
          />
        </Box>
        <Box flex={1} gap="xxs">
          <Text variant="h2">{onboarded ? `Switch to ${label} mode` : `Become a ${label}`}</Text>
          <Text variant="p14" color="textSecondary">
            {onboarded
              ? `Your ${label} dashboard, bookings and messages are kept separately.`
              : target === 'Babysitter'
                ? 'Set your hourly rate. Our team reviews sitter profiles before bookings open up.'
                : 'You’ll be able to find and book sitters with this same account.'}
          </Text>
        </Box>
      </Box>
      {!onboarded && target === 'Babysitter' ? (
        <TextField
          label="Hourly rate"
          icon="cash-outline"
          placeholder="20"
          value={rate}
          onChangeText={(v) => setRate(v.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
          trailing={
            <Text variant="p14Medium" color="textMuted">
              $/hr
            </Text>
          }
        />
      ) : null}
      <Button
        onPress={() => switchRole.mutate()}
        loading={switchRole.isPending}
        disabled={!onboarded && target === 'Babysitter' && !(Number(rate) > 0)}
        icon="swap-horizontal">
        {onboarded ? `Switch to ${label} mode` : `Add ${label} role`}
      </Button>
    </Box>
  );
}
