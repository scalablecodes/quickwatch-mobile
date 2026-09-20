import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { participant } from '@/modules/bookings/lib/status';
import type { Booking } from '@/modules/bookings/types';
import { Avatar, Box, Button, Card, Pressable, Text } from '@/shared/components/ui';
import { formatDay, formatMoney, fullName, hoursBetween } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

export type RequestCardProps = {
  booking: Booking;
  onAccept: () => void;
  onDecline: () => void;
  accepting?: boolean;
  declining?: boolean;
};

/** A booking request as the sitter sees it, with inline accept/decline. */
export function RequestCard({
  booking,
  onAccept,
  onDecline,
  accepting,
  declining,
}: RequestCardProps) {
  const router = useRouter();
  const mother = participant(booking.mother);
  const name = mother ? fullName(mother) : booking.motherName || 'Parent';
  const hours = hoursBetween(booking.startTime, booking.endTime);
  const isDirect = Boolean(booking.babysitter);

  return (
    <Card variant="elevated" gap="sm">
      <Pressable
        accessibilityRole="button"
        pressScale={0.99}
        onPress={() =>
          router.push({ pathname: '/booking/[id]', params: { id: booking._id, request: '1' } })
        }>
        <Box gap="sm">
          <Box flexDirection="row" alignItems="center" gap="sm">
            <Avatar uri={mother?.picture} name={name} size={44} />
            <Box flex={1} gap="xxs">
              <Text variant="h4" numberOfLines={1}>
                {name}
              </Text>
              <Text variant="p12" color="textMuted" numberOfLines={1}>
                {[mother?.city, mother?.state].filter(Boolean).join(', ') || booking.location}
              </Text>
            </Box>
            <Box alignItems="flex-end">
              <Text variant="p16Bold" color="primary">
                {formatMoney(booking.requestedAmount)}
              </Text>
              <Text variant="micro">
                {hours ? `${hours}h · ` : ''}
                {booking.childNo} {booking.childNo === 1 ? 'child' : 'children'}
              </Text>
            </Box>
          </Box>
          <Box flexDirection="row" gap="m" flexWrap="wrap">
            <Meta icon="calendar-outline" text={formatDay(booking.selectedStartDate)} />
            <Meta icon="time-outline" text={`${booking.startTime} – ${booking.endTime}`} />
            {isDirect ? (
              <Meta icon="person-circle-outline" text="Requested you" tint />
            ) : (
              <Meta icon="megaphone-outline" text="Open to any sitter" />
            )}
          </Box>
          {booking.childrenDescription ? (
            <Text variant="p14" color="textSecondary" numberOfLines={2}>
              {booking.childrenDescription}
            </Text>
          ) : null}
        </Box>
      </Pressable>
      <Box flexDirection="row" gap="s">
        <Box flex={1}>
          <Button
            size="md"
            variant="outline"
            onPress={onDecline}
            loading={declining}
            disabled={accepting}>
            Decline
          </Button>
        </Box>
        <Box flex={1}>
          <Button
            size="md"
            icon="checkmark"
            onPress={onAccept}
            loading={accepting}
            disabled={declining}>
            Accept
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

function Meta({
  icon,
  text,
  tint = false,
}: {
  icon: 'calendar-outline' | 'time-outline' | 'person-circle-outline' | 'megaphone-outline';
  text: string;
  tint?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Box flexDirection="row" alignItems="center" gap="xs">
      <Ionicons name={icon} size={15} color={tint ? colors.primary : colors.textMuted} />
      <Text variant="p12Medium" color={tint ? 'primary' : 'textSecondary'}>
        {text}
      </Text>
    </Box>
  );
}
