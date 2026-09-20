import { useRouter } from 'expo-router';

import { useSession } from '@/modules/auth/session';
import { useUnreadCount } from '@/modules/notifications/queries';
import { Avatar, Box, IconButton, Pressable, Text } from '@/shared/components/ui';
import { fullName } from '@/shared/lib/format';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Avatar, greeting and the notification bell shared by both home dashboards. */
export function HomeHeader() {
  const router = useRouter();
  const { user } = useSession();
  const unread = useUnreadCount();

  return (
    <Box flexDirection="row" alignItems="center" gap="sm">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile"
        onPress={() => router.push('/profile')}>
        <Avatar uri={user?.picture} name={fullName(user)} size={46} ring />
      </Pressable>
      <Box flex={1}>
        <Text variant="p12Medium" color="textMuted">
          {greeting()},
        </Text>
        <Text variant="h3" numberOfLines={1}>
          {user?.FirstName} 👋
        </Text>
      </Box>
      <IconButton
        icon="notifications-outline"
        accessibilityLabel="Notifications"
        backgroundColor="cardBackground"
        badge={(unread.data ?? 0) > 0}
        onPress={() => router.push('/notifications')}
      />
    </Box>
  );
}
