import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useSession } from '@/modules/auth/session';
import { paymentsApi } from '@/modules/payments/api';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, Card, ScrollBox, Skeleton, StatusPill, Text } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { useTheme } from '@/shared/theme';

/** Stripe Connect onboarding for sitters, plus the current payout account status. */
export function PayoutsScreen() {
  const toast = useToast();
  const { colors } = useTheme();
  const { refresh } = useSession();
  const account = useQuery({
    queryKey: ['payout-account'],
    queryFn: () => paymentsApi.payoutAccount(),
  });

  const setup = useMutation({
    mutationFn: async () => {
      const returnUrl = Linking.createURL('/settings/payouts');
      const { url } = await paymentsApi.createPayoutAccount(returnUrl);
      await WebBrowser.openAuthSessionAsync(url, returnUrl);
    },
    onSuccess: async () => {
      await Promise.all([account.refetch(), refresh()]);
    },
    onError: (e) => toast.error('Could not open payout setup', errorMessage(e)),
  });

  const status = account.data?.status ?? 'not_started';
  const enabled = status === 'enabled';

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title="Payouts" />
      <ScrollBox flex={1} contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 14 }}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card variant="elevated" gap="m" alignItems="center" paddingVertical="l">
            <Box
              width={88}
              height={88}
              borderRadius="full"
              backgroundColor={enabled ? 'successSoft' : 'primarySoft'}
              alignItems="center"
              justifyContent="center">
              <Ionicons
                name={enabled ? 'checkmark-circle' : 'wallet'}
                size={40}
                color={enabled ? colors.success : colors.primary}
              />
            </Box>
            {account.isLoading ? (
              <Skeleton width={160} height={20} />
            ) : (
              <>
                <StatusPill
                  label={
                    enabled
                      ? 'Payouts enabled'
                      : status === 'pending'
                        ? 'Setup in progress'
                        : 'Not set up'
                  }
                  tone={enabled ? 'success' : status === 'pending' ? 'warning' : 'neutral'}
                />
                <Text variant="p14" color="textSecondary" textAlign="center">
                  {enabled
                    ? 'You’re ready to receive payouts. After a family pays and the job is complete, request your payout from the booking.'
                    : status === 'pending'
                      ? 'Stripe still needs a few details. Continue where you left off to finish setup.'
                      : 'QuickWatch pays sitters through Stripe. Connect a bank account to receive your earnings.'}
                </Text>
              </>
            )}
            {!enabled ? (
              <Button icon="open-outline" onPress={() => setup.mutate()} loading={setup.isPending}>
                {status === 'pending' ? 'Continue setup' : 'Set up payouts'}
              </Button>
            ) : (
              <Button
                variant="outline"
                icon="refresh"
                onPress={() => account.refetch()}
                loading={account.isRefetching}>
                Refresh status
              </Button>
            )}
          </Card>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <Card gap="sm">
            <Text variant="h4">How you get paid</Text>
            {[
              ['1', 'A family books you and pays QuickWatch up front.'],
              ['2', 'You complete the job and mark it done.'],
              ['3', 'Request your payout — we transfer your earnings to your bank.'],
            ].map(([n, text]) => (
              <Box key={n} flexDirection="row" gap="sm" alignItems="flex-start">
                <Box
                  width={24}
                  height={24}
                  borderRadius="full"
                  backgroundColor="primarySoft"
                  alignItems="center"
                  justifyContent="center">
                  <Text variant="p12Bold" color="primary">
                    {n}
                  </Text>
                </Box>
                <Text variant="p14" color="textSecondary" style={{ flex: 1 }}>
                  {text}
                </Text>
              </Box>
            ))}
          </Card>
        </Animated.View>
      </ScrollBox>
    </Box>
  );
}
