import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/modules/auth/session';
import { bookingsApi } from '@/modules/bookings/api';
import { Timeline } from '@/modules/bookings/components/Timeline';
import {
  bookingStatus,
  bookingTotal,
  participant,
  participantId,
} from '@/modules/bookings/lib/status';
import { useBooking, useBookingMutation, useSitterRequests } from '@/modules/bookings/queries';
import { paymentsApi } from '@/modules/payments/api';
import { usePayBooking } from '@/modules/payments/use-pay-booking';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Pressable,
  ScrollBox,
  Skeleton,
  Stars,
  StatusPill,
  Text,
  type IoniconName,
} from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { formatDate, formatMoney, fullName, hoursBetween } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

/** Everything about one booking, with the actions the viewer can take right now. */
export function BookingDetailScreen() {
  const { id, request } = useLocalSearchParams<{ id: string; request?: string }>();
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user, isBabysitter } = useSession();

  const mine = useBooking(id);
  const requests = useSitterRequests(isBabysitter);
  const booking = mine.booking ?? requests.data?.find((b) => b._id === id) ?? null;
  const fromRequests = !mine.booking && Boolean(request);

  const accept = useBookingMutation(() => bookingsApi.accept(id));
  const lifecycle = useBookingMutation(
    (vars: { status: 'declined' | 'inProgress' | 'completed' | 'cancelled'; reason?: string }) =>
      // Cancellation has a dedicated endpoint that records who cancelled and why.
      vars.status === 'cancelled'
        ? bookingsApi.cancel(id, vars.reason)
        : bookingsApi.setLifecycle(id, vars.status, vars.reason)
  );
  const requestPayout = useBookingMutation(() => paymentsApi.requestPayout(id));
  const refund = useBookingMutation(() => paymentsApi.refund(id));
  const pay = usePayBooking(id);

  const invalidateRequests = useMutation({ mutationFn: async () => requests.refetch() });

  if (!booking) {
    return (
      <Box flex={1} backgroundColor="screenBackground">
        <ScreenHeader title="Booking" />
        {mine.isLoading || requests.isLoading ? (
          <Box padding="ml" gap="sm">
            <Skeleton height={90} radius={20} />
            <Skeleton height={60} radius={20} />
            <Skeleton height={200} radius={20} />
          </Box>
        ) : (
          <Box padding="ml">
            <Text variant="p16" color="textSecondary">
              This booking is no longer available.
            </Text>
          </Box>
        )}
      </Box>
    );
  }

  const mother = participant(booking.mother);
  const sitter = participant(booking.babysitter);
  const meId = user?._id;
  const iAmMother = participantId(booking.mother) === meId;
  const iAmSitter = !iAmMother && (participantId(booking.babysitter) === meId || fromRequests);
  const other = iAmMother ? sitter : mother;
  const otherName = other
    ? fullName(other)
    : iAmMother
      ? 'Open request'
      : booking.motherName || 'Parent';
  const status = bookingStatus(booking);
  const s = booking.lifecycleStatus;
  const paid = booking.paymentStatus === 'paid';
  const hours = hoursBetween(booking.startTime, booking.endTime);
  const busy =
    accept.isPending ||
    lifecycle.isPending ||
    pay.isPending ||
    requestPayout.isPending ||
    refund.isPending;
  const canChat = Boolean(mother && sitter) && !['declined', 'cancelled', 'refunded'].includes(s);

  const confirm = (title: string, message: string, onConfirm: () => void, destructive = false) =>
    Alert.alert(title, message, [
      { text: 'Keep', style: 'cancel' },
      { text: title, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
    ]);

  const onError = (title: string) => (e: unknown) => toast.error(title, errorMessage(e));

  const actions = (() => {
    const list: React.ReactNode[] = [];
    if (iAmSitter && s === 'requested') {
      list.push(
        <Button
          key="accept"
          icon="checkmark"
          loading={accept.isPending}
          disabled={busy}
          onPress={() =>
            accept.mutate(undefined, {
              onSuccess: () => {
                toast.success('Request accepted', 'The parent can now pay to confirm.');
                invalidateRequests.mutate();
              },
              onError: onError('Could not accept'),
            })
          }>
          Accept request
        </Button>,
        <Button
          key="decline"
          variant="outline"
          disabled={busy}
          loading={lifecycle.isPending}
          onPress={() =>
            confirm(
              'Decline',
              'Decline this request? The parent will be notified.',
              () =>
                lifecycle.mutate(
                  { status: 'declined' },
                  {
                    onSuccess: () => {
                      toast.info('Request declined');
                      invalidateRequests.mutate();
                      router.back();
                    },
                    onError: onError('Could not decline'),
                  }
                ),
              true
            )
          }>
          Decline
        </Button>
      );
    }
    if (iAmMother && s === 'requested') {
      list.push(
        <Button
          key="edit"
          variant="secondary"
          icon="create-outline"
          disabled={busy}
          onPress={() =>
            router.push({ pathname: '/booking/new', params: { bookingId: booking._id } })
          }>
          Edit request
        </Button>
      );
    }
    if (iAmMother && s === 'accepted' && !paid) {
      list.push(
        <Button
          key="pay"
          icon="card-outline"
          loading={pay.isPending}
          disabled={busy}
          onPress={() => pay.mutate()}>
          {`Pay ${formatMoney(bookingTotal(booking))} to confirm`}
        </Button>
      );
    }
    if (iAmSitter && s === 'accepted' && paid) {
      list.push(
        <Button
          key="start"
          icon="play"
          loading={lifecycle.isPending}
          disabled={busy}
          onPress={() =>
            lifecycle.mutate(
              { status: 'inProgress' },
              { onSuccess: () => toast.success('Job started'), onError: onError('Could not start') }
            )
          }>
          Start job
        </Button>
      );
    }
    if (
      (iAmSitter && s === 'inProgress') ||
      (iAmMother && (s === 'inProgress' || (s === 'accepted' && paid)))
    ) {
      list.push(
        <Button
          key="complete"
          icon="checkmark-done"
          variant={iAmSitter ? 'primary' : 'secondary'}
          loading={lifecycle.isPending}
          disabled={busy}
          onPress={() =>
            confirm('Mark completed', 'Confirm the babysitting is done?', () =>
              lifecycle.mutate(
                { status: 'completed' },
                {
                  onSuccess: () =>
                    toast.success('Booking completed', 'Don’t forget to leave a review.'),
                  onError: onError('Could not complete'),
                }
              )
            )
          }>
          Mark as completed
        </Button>
      );
    }
    if (s === 'completed' && (iAmMother || iAmSitter)) {
      list.push(
        <Button
          key="review"
          icon="star-outline"
          variant="secondary"
          disabled={busy}
          onPress={() =>
            router.push({
              pathname: '/booking/review',
              params: { bookingId: booking._id, name: otherName },
            })
          }>
          {`Review ${iAmMother ? 'sitter' : 'parent'}`}
        </Button>
      );
    }
    if (
      iAmSitter &&
      paid &&
      booking.motherConfirmedAt &&
      s === 'completed' &&
      booking.payoutStatus === 'not_ready'
    ) {
      list.push(
        <Button
          key="payout"
          icon="wallet-outline"
          loading={requestPayout.isPending}
          disabled={busy}
          onPress={() =>
            requestPayout.mutate(undefined, {
              onSuccess: () =>
                toast.success(
                  'Payout requested',
                  'We’ll send your earnings to your payout account.'
                ),
              onError: onError('Could not request payout'),
            })
          }>
          Request payout
        </Button>
      );
    }
    if (
      (iAmMother && ['requested', 'accepted'].includes(s)) ||
      (iAmSitter && s === 'accepted' && !paid)
    ) {
      list.push(
        <Button
          key="cancel"
          variant="danger"
          disabled={busy}
          loading={lifecycle.isPending}
          onPress={() =>
            confirm(
              'Cancel booking',
              paid
                ? 'This booking is paid. Cancelling will need a refund from support.'
                : 'Cancel this booking? This can’t be undone.',
              () =>
                lifecycle.mutate(
                  { status: 'cancelled' },
                  {
                    onSuccess: () => toast.info('Booking cancelled'),
                    onError: onError('Could not cancel'),
                  }
                ),
              true
            )
          }>
          Cancel booking
        </Button>
      );
    }
    if (iAmMother && paid && s !== 'refunded' && s !== 'completed') {
      list.push(
        <Button
          key="refund"
          variant="ghost"
          disabled={busy}
          loading={refund.isPending}
          onPress={() =>
            confirm(
              'Request refund',
              'Refund this payment and close the booking?',
              () =>
                refund.mutate(undefined, {
                  onSuccess: () => toast.success('Refund issued'),
                  onError: onError('Could not refund'),
                }),
              true
            )
          }>
          Request a refund
        </Button>
      );
    }
    return list;
  })();

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader
        title="Booking"
        right={
          canChat ? (
            <IconButton
              icon="chatbubble-ellipses-outline"
              accessibilityLabel="Open chat"
              backgroundColor="cardBackground"
              onPress={() =>
                router.push({ pathname: '/chat/[bookingId]', params: { bookingId: booking._id } })
              }
            />
          ) : undefined
        }
      />
      <ScrollBox
        flex={1}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 4,
          gap: 14,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card variant="elevated" gap="m">
            <Box flexDirection="row" alignItems="center" gap="sm">
              <Pressable
                accessibilityRole="button"
                disabled={!(iAmMother && sitter)}
                onPress={() =>
                  sitter && router.push({ pathname: '/sitter/[id]', params: { id: sitter._id } })
                }>
                <Avatar uri={other?.picture} name={otherName} size={56} />
              </Pressable>
              <Box flex={1} gap="xxs">
                <Text variant="overline">{iAmMother ? 'Babysitter' : 'Parent'}</Text>
                <Text variant="h3" numberOfLines={1}>
                  {otherName}
                </Text>
                {other?.ratingCount ? (
                  <Box flexDirection="row" alignItems="center" gap="xs">
                    <Stars value={other.ratingAverage ?? 0} size={13} />
                    <Text variant="p12" color="textMuted">
                      {other.ratingAverage?.toFixed(1)} ({other.ratingCount})
                    </Text>
                  </Box>
                ) : null}
              </Box>
              <StatusPill label={status.label} tone={status.tone} />
            </Box>
            <Timeline booking={booking} />
            {s === 'cancelled' || s === 'declined' ? (
              <Box backgroundColor="dangerSoft" borderRadius="m" padding="sm">
                <Text variant="p12Medium" color="danger">
                  {s === 'declined'
                    ? 'The sitter declined this request.'
                    : 'This booking was cancelled.'}
                  {booking.cancellationReason ? ` “${booking.cancellationReason}”` : ''}
                </Text>
              </Box>
            ) : null}
            {iAmMother && s === 'accepted' && !paid ? (
              <Box
                backgroundColor="warningSoft"
                borderRadius="m"
                padding="sm"
                flexDirection="row"
                gap="s"
                alignItems="center">
                <Ionicons name="alert-circle" size={18} color={colors.warning} />
                <Text variant="p12Medium" color="warning" style={{ flex: 1 }}>
                  {otherName} accepted. Pay now to lock in the booking.
                </Text>
              </Box>
            ) : null}
            {iAmSitter && s === 'accepted' && !paid ? (
              <Box
                backgroundColor="infoSoft"
                borderRadius="m"
                padding="sm"
                flexDirection="row"
                gap="s"
                alignItems="center">
                <Ionicons name="hourglass" size={18} color={colors.info} />
                <Text variant="p12Medium" color="info" style={{ flex: 1 }}>
                  Waiting for the parent to pay. You&apos;ll be notified once it&apos;s confirmed.
                </Text>
              </Box>
            ) : null}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(400)}>
          <Card gap="sm">
            <Text variant="h4">Details</Text>
            <Row
              icon="calendar-outline"
              label="Date"
              value={formatDate(booking.selectedStartDate)}
            />
            <Row
              icon="time-outline"
              label="Time"
              value={`${booking.startTime} – ${booking.endTime}${hours ? ` · ${hours}h` : ''}`}
            />
            <Row
              icon="people-outline"
              label="Children"
              value={`${booking.childNo || 1}${booking.childOption2 ? ` · ${booking.childOption2}` : ''}`}
            />
            <Row icon="location-outline" label="Area" value={booking.location} />
            {(iAmMother || paid) && booking.address ? (
              <Row
                icon="home-outline"
                label="Address"
                value={`${booking.address}${booking.zipcode ? `, ${booking.zipcode}` : ''}`}
              />
            ) : null}
            {booking.childrenDescription ? (
              <Note label="About the children" text={booking.childrenDescription} />
            ) : null}
            {booking.specialInstructions ? (
              <Note label="Special instructions" text={booking.specialInstructions} />
            ) : null}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(400)}>
          <Card gap="s">
            <Text variant="h4">Payment</Text>
            {booking.totalAmount > 0 ? (
              <>
                <Line
                  label={`Sitter${booking.sitterHourlyRate ? ` (${formatMoney(booking.sitterHourlyRate)}/hr)` : ''}`}
                  value={formatMoney(booking.serviceAmount)}
                />
                <Line label="Service fee" value={formatMoney(booking.companyFee)} />
                <Box height={1} backgroundColor="border" marginVertical="xs" />
                <Line
                  label={iAmSitter ? 'Parent pays' : 'Total'}
                  value={formatMoney(booking.totalAmount)}
                  bold
                />
                {iAmSitter ? (
                  <Line label="You receive" value={formatMoney(booking.serviceAmount)} bold />
                ) : null}
              </>
            ) : (
              <>
                <Line label="Offered to sitter" value={formatMoney(booking.requestedAmount)} bold />
                <Text variant="p12" color="textMuted">
                  A small service fee is added once a sitter accepts.
                </Text>
              </>
            )}
            <Box flexDirection="row" gap="s" marginTop="xs">
              <StatusPill
                label={
                  paid ? 'Paid' : booking.paymentStatus === 'pending' ? 'Payment pending' : 'Unpaid'
                }
                tone={
                  paid ? 'success' : booking.paymentStatus === 'pending' ? 'warning' : 'neutral'
                }
              />
              {iAmSitter && booking.payoutStatus !== 'not_ready' ? (
                <StatusPill
                  label={booking.payoutStatus === 'paid' ? 'Payout sent' : 'Payout requested'}
                  tone={booking.payoutStatus === 'paid' ? 'success' : 'info'}
                />
              ) : null}
            </Box>
          </Card>
        </Animated.View>

        {actions.length > 0 ? (
          <Animated.View entering={FadeInUp.delay(240).duration(400)}>
            <Box gap="s" marginTop="xs">
              {actions}
            </Box>
          </Animated.View>
        ) : null}
      </ScrollBox>
    </Box>
  );
}

function Row({ icon, label, value }: { icon: IoniconName; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <Box flexDirection="row" alignItems="center" gap="sm">
      <Box
        width={34}
        height={34}
        borderRadius="s"
        backgroundColor="cardBackgroundSubtle"
        alignItems="center"
        justifyContent="center">
        <Ionicons name={icon} size={17} color={colors.textSecondary} />
      </Box>
      <Box flex={1}>
        <Text variant="micro">{label}</Text>
        <Text variant="p14Medium">{value}</Text>
      </Box>
    </Box>
  );
}

function Note({ label, text }: { label: string; text: string }) {
  return (
    <Box backgroundColor="cardBackgroundSubtle" borderRadius="m" padding="sm" gap="xxs">
      <Text variant="micro">{label}</Text>
      <Text variant="p14" color="textSecondary">
        {text}
      </Text>
    </Box>
  );
}

function Line({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
      <Text variant={bold ? 'p14SemiBold' : 'p14'} color={bold ? 'text' : 'textSecondary'}>
        {label}
      </Text>
      <Text variant={bold ? 'p16Bold' : 'p14Medium'} color={bold ? 'primary' : 'text'}>
        {value}
      </Text>
    </Box>
  );
}
