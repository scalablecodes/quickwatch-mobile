import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { NotificationPreferences } from '@/modules/auth/types';
import { notificationsApi } from '@/modules/notifications/api';
import { notificationKeys } from '@/modules/notifications/queries';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import {
  Box,
  Card,
  Divider,
  ListRow,
  ScrollBox,
  Skeleton,
  Text,
  Toggle,
  type IoniconName,
} from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';

const rows: {
  key: keyof NotificationPreferences;
  icon: IoniconName;
  title: string;
  subtitle: string;
}[] = [
  {
    key: 'push',
    icon: 'phone-portrait-outline',
    title: 'Push notifications',
    subtitle: 'Alerts on this device',
  },
  { key: 'email', icon: 'mail-outline', title: 'Email', subtitle: 'Copies of important updates' },
  {
    key: 'booking',
    icon: 'calendar-outline',
    title: 'Bookings',
    subtitle: 'Requests, acceptances, changes',
  },
  { key: 'payment', icon: 'card-outline', title: 'Payments', subtitle: 'Receipts and payouts' },
  { key: 'chat', icon: 'chatbubble-outline', title: 'Messages', subtitle: 'New chat messages' },
  {
    key: 'marketing',
    icon: 'sparkles-outline',
    title: 'Tips & offers',
    subtitle: 'Occasional news from QuickWatch',
  },
];

export function NotificationSettingsScreen() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const prefs = useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: async () => (await notificationsApi.preferences()).preferences,
  });

  const update = useMutation({
    mutationFn: (input: Partial<NotificationPreferences>) =>
      notificationsApi.updatePreferences(input),
    onMutate: (input) => {
      queryClient.setQueryData<NotificationPreferences>(notificationKeys.preferences(), (c) =>
        c ? { ...c, ...input } : c
      );
    },
    onError: (e) => {
      toast.error('Could not save', errorMessage(e));
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
    },
  });

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title="Notifications" />
      <ScrollBox flex={1} contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 12 }}>
        <Text variant="p14" color="textSecondary">
          Choose what QuickWatch should tell you about.
        </Text>
        {prefs.isLoading ? (
          <Skeleton height={320} radius={20} />
        ) : (
          <Card>
            {rows.map((row, i) => (
              <Box key={row.key}>
                <ListRow
                  icon={row.icon}
                  title={row.title}
                  subtitle={row.subtitle}
                  iconBackground="cardBackgroundSubtle"
                  iconColor="textSecondary"
                  trailing={
                    <Toggle
                      value={prefs.data?.[row.key] ?? false}
                      onValueChange={(v) => update.mutate({ [row.key]: v })}
                    />
                  }
                />
                {i < rows.length - 1 ? <Divider /> : null}
              </Box>
            ))}
          </Card>
        )}
      </ScrollBox>
    </Box>
  );
}
