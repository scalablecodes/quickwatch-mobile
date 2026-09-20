import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/modules/auth/session';
import { useMyBookings } from '@/modules/bookings/queries';
import { paymentsApi } from '@/modules/payments/api';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import {
  Box,
  Card,
  EmptyState,
  Pressable,
  Skeleton,
  StatusPill,
  Text,
  type StatusTone,
} from '@/shared/components/ui';
import { formatDate, formatMoney } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

type Row = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  currency: string;
  status: string;
  tone: StatusTone;
  bookingId?: string;
  date: string;
};

/** Parents see their card payments; sitters see earnings per paid booking and payout state. */
export function PaymentHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { isBabysitter } = useSession();
  const payments = useQuery({
    queryKey: ['payments'],
    queryFn: async () => (await paymentsApi.history()).payments,
    enabled: !isBabysitter,
  });
  const bookings = useMyBookings();

  const rows: Row[] = isBabysitter
    ? (bookings.data ?? [])
        .filter((b) => b.paymentStatus === 'paid')
        .map((b) => ({
          id: b._id,
          bookingId: b._id,
          title: b.motherName || 'Booking',
          subtitle: formatDate(b.selectedStartDate),
          amount: b.serviceAmount || b.requestedAmount,
          currency: 'usd',
          status:
            b.payoutStatus === 'paid'
              ? 'Paid out'
              : b.payoutStatus === 'requested'
                ? 'Payout requested'
                : 'Earned',
          tone:
            b.payoutStatus === 'paid'
              ? 'success'
              : b.payoutStatus === 'requested'
                ? 'info'
                : 'primary',
          date: b.motherConfirmedAt ?? b.updatedAt,
        }))
    : (payments.data ?? []).map((p) => {
        const booking = typeof p.booking === 'object' && p.booking ? p.booking : null;
        return {
          id: p._id,
          bookingId: booking?._id,
          title: booking?.watcherName || 'Booking payment',
          subtitle: booking ? formatDate(booking.selectedStartDate) : formatDate(p.createdAt),
          amount: p.amount,
          currency: p.currency,
          status:
            p.status === 'succeeded'
              ? 'Paid'
              : p.status === 'refunded'
                ? 'Refunded'
                : p.status === 'failed'
                  ? 'Failed'
                  : 'Pending',
          tone:
            p.status === 'succeeded'
              ? 'success'
              : p.status === 'refunded'
                ? 'neutral'
                : p.status === 'failed'
                  ? 'danger'
                  : 'warning',
          date: p.createdAt,
        };
      });
  const sorted = [...rows].sort((a, b) => (a.date < b.date ? 1 : -1));
  const total = sorted
    .filter((r) => r.tone === 'success' || r.tone === 'primary' || r.tone === 'info')
    .reduce((s, r) => s + r.amount, 0);
  const loading = isBabysitter ? bookings.isLoading : payments.isLoading;

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title={isBabysitter ? 'Earnings' : 'Payments'} />
      {loading ? (
        <Box paddingHorizontal="ml" gap="sm">
          <Skeleton height={110} radius={20} />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={72} radius={16} />
          ))}
        </Box>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 24,
            gap: 8,
          }}
          refreshControl={
            <RefreshControl
              refreshing={payments.isRefetching || bookings.isRefetching}
              onRefresh={() => {
                payments.refetch();
                bookings.refetch();
              }}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Animated.View entering={FadeInDown.duration(400)}>
              <Card variant="primary" marginBottom="s" gap="xs">
                <Text variant="overline" color="onPrimaryMuted">
                  {isBabysitter ? 'Total earned' : 'Total spent'}
                </Text>
                <Text variant="stat" color="onPrimary">
                  {formatMoney(total)}
                </Text>
                <Text variant="p12" color="onPrimaryMuted">
                  {sorted.length} {sorted.length === 1 ? 'transaction' : 'transactions'}
                </Text>
              </Card>
            </Animated.View>
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40).duration(300)}>
              <Pressable
                accessibilityRole="button"
                pressScale={0.99}
                disabled={!item.bookingId}
                onPress={() =>
                  item.bookingId &&
                  router.push({ pathname: '/booking/[id]', params: { id: item.bookingId } })
                }>
                <Card flexDirection="row" alignItems="center" gap="sm" padding="sm">
                  <Box
                    width={42}
                    height={42}
                    borderRadius="m"
                    backgroundColor="cardBackgroundSubtle"
                    alignItems="center"
                    justifyContent="center">
                    <Ionicons
                      name={isBabysitter ? 'arrow-down' : 'arrow-up'}
                      size={18}
                      color={isBabysitter ? colors.success : colors.textSecondary}
                    />
                  </Box>
                  <Box flex={1} gap="xxs">
                    <Text variant="p14SemiBold" numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text variant="p12" color="textMuted">
                      {item.subtitle}
                    </Text>
                  </Box>
                  <Box alignItems="flex-end" gap="xs">
                    <Text variant="p14Bold">{formatMoney(item.amount, item.currency)}</Text>
                    <StatusPill label={item.status} tone={item.tone} />
                  </Box>
                </Card>
              </Pressable>
            </Animated.View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title={isBabysitter ? 'No earnings yet' : 'No payments yet'}
              message={
                isBabysitter
                  ? 'Completed, paid bookings will appear here.'
                  : 'Payments for confirmed bookings will appear here.'
              }
            />
          }
        />
      )}
    </Box>
  );
}
