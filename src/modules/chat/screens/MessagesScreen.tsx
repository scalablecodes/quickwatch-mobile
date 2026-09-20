import { useRouter } from 'expo-router';
import { FlatList, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/modules/auth/session';
import { bookingStatus, participant } from '@/modules/bookings/lib/status';
import { useMyBookings } from '@/modules/bookings/queries';
import { useTabBarInset } from '@/shared/components/AppTabs';
import {
  Avatar,
  Box,
  Card,
  EmptyState,
  Pressable,
  Skeleton,
  StatusPill,
  Text,
} from '@/shared/components/ui';
import { formatDay, fullName } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

/** "Messages" tab: one conversation per booking that has both a parent and a sitter. */
export function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const { colors } = useTheme();
  const { isMother } = useSession();
  const { data, isLoading, refetch, isRefetching } = useMyBookings();

  const threads = (data ?? []).filter(
    (b) =>
      participant(b.mother) &&
      participant(b.babysitter) &&
      !['declined', 'cancelled', 'refunded'].includes(b.lifecycleStatus)
  );

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <Box paddingHorizontal="ml" paddingBottom="sm" style={{ paddingTop: insets.top + 12 }}>
        <Text variant="h1">Messages</Text>
      </Box>
      {isLoading ? (
        <Box paddingHorizontal="ml" gap="sm">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={84} radius={20} />
          ))}
        </Box>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(b) => b._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: bottomInset, gap: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const other = participant(isMother ? item.babysitter : item.mother);
            const name = fullName(other);
            const status = bookingStatus(item);
            return (
              <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 50).duration(350)}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Chat with ${name}`}
                  onPress={() =>
                    router.push({ pathname: '/chat/[bookingId]', params: { bookingId: item._id } })
                  }>
                  <Card variant="elevated" flexDirection="row" alignItems="center" gap="sm">
                    <Avatar uri={other?.picture} name={name} size={50} />
                    <Box flex={1} gap="xxs">
                      <Text variant="h4" numberOfLines={1}>
                        {name}
                      </Text>
                      <Text variant="p12" color="textMuted" numberOfLines={1}>
                        {formatDay(item.selectedStartDate)} · {item.startTime} – {item.endTime}
                      </Text>
                    </Box>
                    <StatusPill label={status.label} tone={status.tone} />
                  </Card>
                </Pressable>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon="chatbubbles-outline"
              title="No conversations yet"
              message={
                isMother
                  ? 'Once a sitter accepts your request you can chat here.'
                  : 'Accept a request to start chatting with the family.'
              }
            />
          }
        />
      )}
    </Box>
  );
}
