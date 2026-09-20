import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/modules/auth/session';
import { BookingCard } from '@/modules/bookings/components/BookingCard';
import { matchesFilter, type BookingFilter } from '@/modules/bookings/lib/status';
import { useMyBookings } from '@/modules/bookings/queries';
import { useTabBarInset } from '@/shared/components/AppTabs';
import { Box, Button, EmptyState, Skeleton, Text } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

import { SegmentedTabs } from '../components/SegmentedTabs';

const filters: { key: BookingFilter; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active', label: 'Confirmed' },
  { key: 'past', label: 'Past' },
];

/** "Bookings" tab: every booking the user is part of, split by stage. */
export function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const { colors } = useTheme();
  const { user, isMother } = useSession();
  const { data, isLoading, refetch, isRefetching } = useMyBookings();
  const [filter, setFilter] = useState<BookingFilter>('upcoming');

  const items = (data ?? []).filter((b) => matchesFilter(b, filter));
  const viewer = user?.role === 'Babysitter' ? 'Babysitter' : 'Mother';

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <Box
        paddingHorizontal="ml"
        paddingBottom="sm"
        gap="m"
        style={{ paddingTop: insets.top + 12 }}>
        <Text variant="h1">Bookings</Text>
        <SegmentedTabs options={filters} value={filter} onChange={setFilter} />
      </Box>
      {isLoading ? (
        <Box paddingHorizontal="ml" gap="sm">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={132} radius={20} />
          ))}
        </Box>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(b) => b._id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: bottomInset,
            gap: 12,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(Math.min(index, 6) * 50).duration(350)}
              layout={LinearTransition}>
              <BookingCard booking={item} viewer={viewer} />
            </Animated.View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon={filter === 'past' ? 'time-outline' : 'calendar-outline'}
              title={
                filter === 'past'
                  ? 'No past bookings'
                  : filter === 'active'
                    ? 'Nothing confirmed yet'
                    : 'No upcoming bookings'
              }
              message={
                isMother
                  ? 'Find a sitter and send a request — it will show up here.'
                  : 'Accepted requests and confirmed jobs will appear here.'
              }
              action={
                isMother ? (
                  <Button
                    size="md"
                    fullWidth={false}
                    icon="search"
                    onPress={() => router.push('/sitter')}>
                    Find a sitter
                  </Button>
                ) : undefined
              }
            />
          }
        />
      )}
    </Box>
  );
}
