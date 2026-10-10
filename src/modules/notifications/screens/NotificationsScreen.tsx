import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
} from '@/modules/notifications/queries';
import type { AppNotification } from '@/modules/notifications/types';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import {
  Box,
  EmptyState,
  IconButton,
  Pressable,
  Skeleton,
  Text,
  type IoniconName,
} from '@/shared/components/ui';
import { formatRelative } from '@/shared/lib/format';
import { useTheme, type ThemeColor } from '@/shared/theme';

function iconFor(type: string): { icon: IoniconName; tint: ThemeColor; bg: ThemeColor } {
  if (type.startsWith('booking.payment') || type.startsWith('payout') || type.startsWith('payment'))
    return { icon: 'card', tint: 'success', bg: 'successSoft' };
  if (type.startsWith('booking')) return { icon: 'calendar', tint: 'primary', bg: 'primarySoft' };
  if (type.startsWith('chat')) return { icon: 'chatbubble-ellipses', tint: 'info', bg: 'infoSoft' };
  if (type.startsWith('review')) return { icon: 'star', tint: 'warning', bg: 'warningSoft' };
  if (type.startsWith('kyc') || type.startsWith('account'))
    return { icon: 'shield-checkmark', tint: 'accent', bg: 'accentSoft' };
  return { icon: 'notifications', tint: 'textSecondary', bg: 'cardBackgroundSubtle' };
}

/** In-app notification inbox. Tapping marks as read and deep-links to the related booking. */
export function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { data, isLoading, refetch, isRefetching } = useNotifications();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const remove = useDeleteNotification();

  const open = (n: AppNotification) => {
    if (!n.readAt) markRead.mutate(n._id);
    const bookingId = n.data?.bookingId;
    if (bookingId && n.data?.action === 'open_chat')
      router.push({ pathname: '/chat/[bookingId]', params: { bookingId } });
    else if (bookingId) router.push({ pathname: '/booking/[id]', params: { id: bookingId } });
    else if (n.data?.action === 'view_kyc') router.push('/settings/verification');
    else if (n.data?.action === 'view_payment') router.push('/settings/payments');
  };

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader
        title="Notifications"
        right={
          (data?.unreadCount ?? 0) > 0 ? (
            <IconButton
              icon="checkmark-done"
              accessibilityLabel="Mark all as read"
              backgroundColor="cardBackground"
              onPress={() => markAll.mutate()}
            />
          ) : undefined
        }
      />
      {isLoading ? (
        <Box paddingHorizontal="ml" gap="sm">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={72} radius={16} />
          ))}
        </Box>
      ) : (
        <FlatList
          data={data?.notifications ?? []}
          keyExtractor={(n) => n._id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 24,
            gap: 8,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const style = iconFor(item.type);
            const unread = !item.readAt;
            return (
              <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40).duration(300)}>
                <Pressable accessibilityRole="button" pressScale={0.99} onPress={() => open(item)}>
                  <Box
                    flexDirection="row"
                    gap="sm"
                    padding="sm"
                    borderRadius="l"
                    backgroundColor={unread ? 'cardBackground' : 'transparent'}
                    borderWidth={unread ? 1 : 0}
                    borderColor="border">
                    <Box
                      width={42}
                      height={42}
                      borderRadius="m"
                      backgroundColor={style.bg}
                      alignItems="center"
                      justifyContent="center">
                      <Ionicons name={style.icon} size={20} color={colors[style.tint]} />
                    </Box>
                    <Box flex={1} gap="xxs">
                      <Box flexDirection="row" alignItems="center" gap="s">
                        <Text
                          variant={unread ? 'p14SemiBold' : 'p14Medium'}
                          style={{ flex: 1 }}
                          numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text variant="micro">{formatRelative(item.createdAt)}</Text>
                      </Box>
                      <Text variant="p12" color="textSecondary" numberOfLines={2}>
                        {item.message}
                      </Text>
                    </Box>
                    <Box alignItems="center" justifyContent="center" gap="s">
                      {unread ? (
                        <Box width={8} height={8} borderRadius="full" backgroundColor="accent" />
                      ) : null}
                      <IconButton
                        icon="trash-outline"
                        accessibilityLabel={`Delete ${item.title}`}
                        size={30}
                        iconSize={15}
                        backgroundColor="transparent"
                        color="textHint"
                        onPress={() => remove.mutate(item._id)}
                      />
                    </Box>
                  </Box>
                </Pressable>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon="notifications-off-outline"
              title="You're all caught up"
              message="Booking updates, messages and payments will show up here."
            />
          }
        />
      )}
    </Box>
  );
}
