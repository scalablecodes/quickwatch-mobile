import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/modules/auth/session';
import { bookingsApi } from '@/modules/bookings/api';
import { BookingCard } from '@/modules/bookings/components/BookingCard';
import { RequestCard } from '@/modules/bookings/components/RequestCard';
import { matchesFilter } from '@/modules/bookings/lib/status';
import { useBookingMutation, useMyBookings, useSitterRequests } from '@/modules/bookings/queries';
import { useTabBarInset } from '@/shared/components/AppTabs';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { useToast } from '@/shared/components/Toast';
import {
  Box,
  Card,
  Pressable,
  ScrollBox,
  Skeleton,
  Text,
  type IoniconName,
} from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { formatMoney } from '@/shared/lib/format';
import { useTheme, type ThemeColor } from '@/shared/theme';

import { HomeHeader } from './HomeHeader';

/** Sitter dashboard: earnings/rating at a glance, new requests to act on, next jobs. */
export function SitterHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const toast = useToast();
  const { colors } = useTheme();
  const { user } = useSession();

  const requests = useSitterRequests();
  const bookings = useMyBookings();
  const accept = useBookingMutation((id: string) => bookingsApi.accept(id));
  const decline = useBookingMutation((id: string) => bookingsApi.setLifecycle(id, 'declined'));

  const mine = bookings.data ?? [];
  const upcoming = mine
    .filter((b) => matchesFilter(b, 'active') || b.lifecycleStatus === 'accepted')
    .sort((a, b) => (a.selectedStartDate < b.selectedStartDate ? -1 : 1))
    .slice(0, 3);
  const earned = mine
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.serviceAmount || b.requestedAmount || 0), 0);
  const completed = mine.filter((b) => b.lifecycleStatus === 'completed').length;
  const payoutReady = user?.payoutAccountStatus === 'enabled';

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScrollBox
        flex={1}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: bottomInset,
          gap: 22,
        }}
        refreshControl={
          <RefreshControl
            refreshing={requests.isRefetching}
            onRefresh={() => {
              requests.refetch();
              bookings.refetch();
            }}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}>
        <HomeHeader />

        <Animated.View entering={FadeInDown.duration(450)}>
          <Box flexDirection="row" gap="sm">
            <Stat
              icon="wallet"
              label="Earned"
              value={formatMoney(earned)}
              bg="primary"
              fg="onPrimary"
            />
            <Stat
              icon="star"
              label="Rating"
              value={user?.ratingCount ? (user.ratingAverage ?? 0).toFixed(1) : 'New'}
              bg="cardBackground"
              fg="text"
            />
            <Stat
              icon="checkmark-done"
              label="Jobs"
              value={String(completed)}
              bg="cardBackground"
              fg="text"
            />
          </Box>
        </Animated.View>

        {!payoutReady ? (
          <Animated.View entering={FadeInUp.delay(60).duration(450)}>
            <Pressable accessibilityRole="button" onPress={() => router.push('/settings/payouts')}>
              <Card
                variant="outlined"
                flexDirection="row"
                alignItems="center"
                gap="sm"
                borderColor="accent"
                backgroundColor="accentSoft">
                <Box
                  width={40}
                  height={40}
                  borderRadius="m"
                  backgroundColor="accent"
                  alignItems="center"
                  justifyContent="center">
                  <Ionicons name="card" size={20} color={colors.onAccent} />
                </Box>
                <Box flex={1}>
                  <Text variant="p14SemiBold">Set up payouts</Text>
                  <Text variant="p12" color="textSecondary">
                    Connect a bank account so you can get paid after each job.
                  </Text>
                </Box>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Card>
            </Pressable>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInUp.delay(120).duration(450)}>
          <Box gap="sm">
            <SectionHeader
              title={`New requests${requests.data?.length ? ` (${requests.data.length})` : ''}`}
            />
            {requests.isLoading ? (
              <Skeleton height={200} radius={20} />
            ) : requests.data?.length ? (
              requests.data.map((b) => (
                <Animated.View key={b._id} layout={LinearTransition}>
                  <RequestCard
                    booking={b}
                    accepting={accept.isPending && accept.variables === b._id}
                    declining={decline.isPending && decline.variables === b._id}
                    onAccept={() =>
                      accept.mutate(b._id, {
                        onSuccess: () => {
                          toast.success('Request accepted', 'The parent can now pay to confirm.');
                          requests.refetch();
                        },
                        onError: (e) => toast.error('Could not accept', errorMessage(e)),
                      })
                    }
                    onDecline={() =>
                      decline.mutate(b._id, {
                        onSuccess: () => {
                          toast.info('Request declined');
                          requests.refetch();
                        },
                        onError: (e) => toast.error('Could not decline', errorMessage(e)),
                      })
                    }
                  />
                </Animated.View>
              ))
            ) : (
              <Card variant="subtle" flexDirection="row" alignItems="center" gap="sm">
                <Ionicons name="sparkles-outline" size={22} color={colors.textMuted} />
                <Text variant="p14" color="textSecondary" style={{ flex: 1 }}>
                  No new requests right now. We&apos;ll notify you the moment one comes in.
                </Text>
              </Card>
            )}
          </Box>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(450)}>
          <Box gap="sm">
            <SectionHeader
              title="Upcoming jobs"
              actionLabel="See all"
              onAction={() => router.push('/bookings')}
            />
            {bookings.isLoading ? (
              <Skeleton height={132} radius={20} />
            ) : upcoming.length ? (
              upcoming.map((b) => <BookingCard key={b._id} booking={b} viewer="Babysitter" />)
            ) : (
              <Card variant="subtle">
                <Text variant="p14" color="textSecondary">
                  Accepted jobs will show up here.
                </Text>
              </Card>
            )}
          </Box>
        </Animated.View>
      </ScrollBox>
    </Box>
  );
}

function Stat({
  icon,
  label,
  value,
  bg,
  fg,
}: {
  icon: IoniconName;
  label: string;
  value: string;
  bg: ThemeColor;
  fg: ThemeColor;
}) {
  const { colors } = useTheme();
  return (
    // The card variant sets its own background, so the brand tile uses the `primary`
    // variant rather than an overridden `backgroundColor` (which it would win against).
    <Card
      flex={1}
      gap="xs"
      padding="sm"
      variant={bg === 'primary' ? 'primary' : 'elevated'}
      borderRadius="xl">
      <Ionicons
        name={icon}
        size={18}
        color={bg === 'primary' ? colors.onPrimaryMuted : colors.primary}
      />
      <Text variant="h3" color={fg} numberOfLines={1}>
        {value}
      </Text>
      <Text variant="micro" color={bg === 'primary' ? 'onPrimaryMuted' : 'textMuted'}>
        {label}
      </Text>
    </Card>
  );
}
