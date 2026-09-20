import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { bookingStatus, bookingTotal, participant } from '@/modules/bookings/lib/status';
import type { Booking } from '@/modules/bookings/types';
import { Avatar, Box, Card, Pressable, StatusPill, Text } from '@/shared/components/ui';
import { formatDay, formatMoney, fullName } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

export type BookingCardProps = {
  booking: Booking;
  /** Which side of the booking the viewer is on — decides whose avatar to show. */
  viewer: 'Mother' | 'Babysitter';
};

/** Compact booking summary for lists: counterpart, date/time, place, status and total. */
export function BookingCard({ booking, viewer }: BookingCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const other = participant(viewer === 'Mother' ? booking.babysitter : booking.mother);
  const name = other
    ? fullName(other)
    : viewer === 'Mother'
      ? 'Open request'
      : booking.motherName || 'Parent';
  const status = bookingStatus(booking);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Booking with ${name}`}
      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: booking._id } })}>
      <Card variant="elevated" gap="sm">
        <Box flexDirection="row" alignItems="center" gap="sm">
          {other ? (
            <Avatar uri={other.picture} name={name} size={44} />
          ) : (
            <Box
              width={44}
              height={44}
              borderRadius="full"
              backgroundColor="primarySoft"
              alignItems="center"
              justifyContent="center">
              <Ionicons name="megaphone" size={20} color={colors.primary} />
            </Box>
          )}
          <Box flex={1} gap="xxs">
            <Text variant="h4" numberOfLines={1}>
              {name}
            </Text>
            <Text variant="p12" color="textMuted" numberOfLines={1}>
              {booking.location}
            </Text>
          </Box>
          <StatusPill label={status.label} tone={status.tone} />
        </Box>
        <Box height={1} backgroundColor="border" />
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box flexDirection="row" alignItems="center" gap="s">
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text variant="p14Medium">{formatDay(booking.selectedStartDate)}</Text>
            <Text variant="p14" color="textMuted">
              {booking.startTime} – {booking.endTime}
            </Text>
          </Box>
          <Text variant="p14Bold" color="primary">
            {formatMoney(bookingTotal(booking))}
          </Text>
        </Box>
      </Card>
    </Pressable>
  );
}
