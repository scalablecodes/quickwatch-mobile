import { Ionicons } from '@expo/vector-icons';

import type { Booking } from '@/modules/bookings/types';
import { Box, Text } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

type Step = { key: string; label: string; done: boolean; current: boolean };

function steps(b: Booking): Step[] {
  const s = b.lifecycleStatus;
  const paid = b.paymentStatus === 'paid';
  const order = ['requested', 'accepted', 'paid', 'inProgress', 'completed'];
  const reached =
    s === 'completed' ? 5 : s === 'inProgress' ? 4 : paid ? 3 : s === 'accepted' ? 2 : 1;
  const labels: Record<string, string> = {
    requested: 'Requested',
    accepted: 'Accepted',
    paid: 'Paid',
    inProgress: 'In progress',
    completed: 'Completed',
  };
  return order.map((key, i) => ({
    key,
    label: labels[key] ?? key,
    done: i < reached,
    current: i === reached - 1,
  }));
}

/** Horizontal progress of a booking through its lifecycle. */
export function Timeline({ booking }: { booking: Booking }) {
  const { colors } = useTheme();
  const closed = ['cancelled', 'declined', 'refunded'].includes(booking.lifecycleStatus);
  const items = steps(booking);

  return (
    <Box flexDirection="row" alignItems="flex-start">
      {items.map((step, i) => (
        <Box key={step.key} flex={1} alignItems="center" gap="xs">
          <Box flexDirection="row" alignItems="center" alignSelf="stretch">
            <Box
              flex={1}
              height={2}
              backgroundColor={i === 0 ? 'transparent' : step.done ? 'primary' : 'border'}
            />
            <Box
              width={22}
              height={22}
              borderRadius="full"
              backgroundColor={closed ? 'border' : step.done ? 'primary' : 'cardBackground'}
              borderWidth={2}
              borderColor={closed ? 'border' : step.done ? 'primary' : 'borderStrong'}
              alignItems="center"
              justifyContent="center">
              {step.done && !closed ? (
                <Ionicons name="checkmark" size={13} color={colors.onPrimary} />
              ) : null}
            </Box>
            <Box
              flex={1}
              height={2}
              backgroundColor={
                i === items.length - 1 ? 'transparent' : items[i + 1]?.done ? 'primary' : 'border'
              }
            />
          </Box>
          <Text
            variant="micro"
            color={step.current && !closed ? 'primary' : 'textMuted'}
            textAlign="center"
            numberOfLines={1}>
            {step.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
