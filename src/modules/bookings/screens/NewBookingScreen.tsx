import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useSession } from '@/modules/auth/session';
import { bookingsApi } from '@/modules/bookings/api';
import { useBooking, useInvalidateBookings, useUpsertBooking } from '@/modules/bookings/queries';
import { useDateTimeSheet } from '@/shared/components/DateTimeSheet';
import { PickerField } from '@/shared/components/Field';
import { KeyboardScreen } from '@/shared/components/KeyboardScreen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { Stepper } from '@/shared/components/Stepper';
import { useToast } from '@/shared/components/Toast';
import { Avatar, Box, Button, Card, Chip, Text, TextField } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import {
  formatClock,
  formatDay,
  formatMoney,
  hoursBetween,
  parseClock,
  parseDate,
  toDateKey,
} from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

const AGE_BANDS = ['0–11 months', '1–2 years', '3–5 years', '6–10 years', '11+ years'];

type Params = {
  /** Edit an existing request (mother, before acceptance). */
  bookingId?: string;
  sitterId?: string;
  sitterName?: string;
  sitterRate?: string;
  sitterPicture?: string;
  sitterEmail?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
};

function atTime(hours: number, minutes = 0) {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function clockToDate(value?: string): Date | null {
  const minutes = parseClock(value);
  if (minutes === null) return null;
  return atTime(Math.floor(minutes / 60), minutes % 60);
}

/** Create a booking request — for a chosen sitter, or open to any sitter — or edit one. */
export function NewBookingScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const { user } = useSession();
  const params = useLocalSearchParams<Params>();
  const { booking: existing } = useBooking(params.bookingId);
  const invalidate = useInvalidateBookings();
  const upsert = useUpsertBooking();
  const sheet = useDateTimeSheet();

  const sitterRate = Number(params.sitterRate) || 0;
  const editing = Boolean(params.bookingId);

  const [date, setDate] = useState<Date | null>(
    () => parseDate(existing?.selectedStartDate ?? params.date) ?? null
  );
  const [start, setStart] = useState<Date | null>(() =>
    clockToDate(existing?.startTime ?? params.startTime)
  );
  const [end, setEnd] = useState<Date | null>(() =>
    clockToDate(existing?.endTime ?? params.endTime)
  );
  const [children, setChildren] = useState(existing?.childNo || 1);
  const [ages, setAges] = useState<string[]>(() =>
    existing?.childOption2 ? existing.childOption2.split(', ').filter(Boolean) : []
  );
  const [description, setDescription] = useState(existing?.childrenDescription ?? '');
  const [instructions, setInstructions] = useState(existing?.specialInstructions ?? '');
  const [location, setLocation] = useState(
    existing?.location ?? [user?.city, user?.state].filter(Boolean).join(', ')
  );
  const [address, setAddress] = useState(existing?.address ?? user?.Address ?? '');
  const [zip, setZip] = useState(existing?.zipcode ?? user?.zipCode ?? '');
  const [amountText, setAmountText] = useState(
    existing?.requestedAmount ? String(existing.requestedAmount) : ''
  );
  const [amountTouched, setAmountTouched] = useState(Boolean(existing?.requestedAmount));
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const startText = start ? formatClock(start) : '';
  const endText = end ? formatClock(end) : '';
  const hours = hoursBetween(startText, endText);
  const suggested = useMemo(
    () => (sitterRate && hours ? Math.round(sitterRate * hours * 100) / 100 : 0),
    [sitterRate, hours]
  );
  const amount = amountTouched ? Number(amountText) : suggested;

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        selectedStartDate: toDateKey(date as Date),
        startTime: startText,
        endTime: endText,
        location: location.trim(),
        address: address.trim(),
        zipcode: zip.trim(),
        childNo: children,
        childrenDescription: description.trim(),
        specialInstructions: instructions.trim(),
        requestedAmount: amount,
      };
      if (editing && params.bookingId) return bookingsApi.updateDetails(params.bookingId, payload);
      return bookingsApi.create({
        ...payload,
        childOption2: ages.join(', '),
        rateHour: sitterRate ? String(sitterRate) : '',
        motherName: user ? `${user.FirstName} ${user.LastName}` : '',
        picture: user?.picture,
        babysitterId: params.sitterId || undefined,
        emailTo: params.sitterEmail,
        watcherName: params.sitterName,
      });
    },
    onSuccess: ({ booking }) => {
      upsert(booking);
      invalidate();
      toast.success(
        editing ? 'Request updated' : 'Request sent',
        editing
          ? undefined
          : params.sitterId
            ? `${params.sitterName} will be notified.`
            : 'Nearby sitters can now accept it.'
      );
      if (editing) router.back();
      else router.replace({ pathname: '/booking/[id]', params: { id: booking._id } });
    },
    onError: (e) =>
      toast.error(editing ? 'Could not update request' : 'Could not send request', errorMessage(e)),
  });

  const submit = () => {
    const next: Record<string, string | undefined> = {
      date: date ? undefined : 'Pick a date',
      start: start ? undefined : 'Pick a start time',
      end: !end ? 'Pick an end time' : hours <= 0 ? 'End must be after start' : undefined,
      location: location.trim() ? undefined : 'Where is the care needed?',
      amount: amount > 0 ? undefined : 'Enter what you’ll pay',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    save.mutate();
  };

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title={editing ? 'Edit request' : 'New request'} />
      <KeyboardScreen
        footer={
          <Box gap="xs">
            {hours > 0 && amount > 0 ? (
              <Text variant="p12" color="textMuted" textAlign="center">
                {hours}h · you pay {formatMoney(amount)}
                {sitterRate && !amountTouched ? ` (${formatMoney(sitterRate)}/hr)` : ''} + service
                fee on acceptance
              </Text>
            ) : null}
            <Button
              onPress={submit}
              loading={save.isPending}
              icon={editing ? 'save-outline' : 'paper-plane-outline'}>
              {editing ? 'Save changes' : 'Send request'}
            </Button>
          </Box>
        }>
        {params.sitterId ? (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Card variant="outlined" flexDirection="row" alignItems="center" gap="sm">
              <Avatar uri={params.sitterPicture} name={params.sitterName} size={44} />
              <Box flex={1}>
                <Text variant="overline">Requesting</Text>
                <Text variant="h4">{params.sitterName}</Text>
              </Box>
              {sitterRate ? (
                <Text variant="p14Bold" color="primary">
                  {formatMoney(sitterRate)}/hr
                </Text>
              ) : null}
            </Card>
          </Animated.View>
        ) : !editing ? (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Card variant="subtle" flexDirection="row" alignItems="center" gap="sm">
              <Ionicons name="megaphone" size={22} color={colors.primary} />
              <Text variant="p14" color="textSecondary" style={{ flex: 1 }}>
                This is an open request — any approved sitter nearby can accept it.
              </Text>
            </Card>
          </Animated.View>
        ) : null}

        <Section title="When">
          <PickerField
            label="Date"
            icon="calendar-outline"
            placeholder="Choose a date"
            value={date ? formatDay(date) : ''}
            error={errors.date}
            onPress={() =>
              sheet.open({
                mode: 'date',
                title: 'Pick a date',
                value: date ?? new Date(),
                minimumDate: new Date(),
                onChange: (d) => {
                  setDate(d);
                  setErrors((e) => ({ ...e, date: undefined }));
                },
              })
            }
          />
          <Box flexDirection="row" gap="sm">
            <Box flex={1}>
              <PickerField
                label="Start"
                icon="time-outline"
                placeholder="9:00 AM"
                value={startText}
                error={errors.start}
                onPress={() =>
                  sheet.open({
                    mode: 'time',
                    title: 'Start time',
                    value: start ?? atTime(9),
                    onChange: (d) => {
                      setStart(d);
                      setErrors((e) => ({ ...e, start: undefined }));
                    },
                  })
                }
              />
            </Box>
            <Box flex={1}>
              <PickerField
                label="End"
                icon="time-outline"
                placeholder="1:00 PM"
                value={endText}
                error={errors.end}
                onPress={() =>
                  sheet.open({
                    mode: 'time',
                    title: 'End time',
                    value: end ?? atTime(13),
                    onChange: (d) => {
                      setEnd(d);
                      setErrors((e) => ({ ...e, end: undefined }));
                    },
                  })
                }
              />
            </Box>
          </Box>
        </Section>

        <Section title="Children">
          <Stepper
            label="How many children?"
            value={children}
            min={1}
            max={8}
            onChange={setChildren}
          />
          {!editing ? (
            <Box gap="s">
              <Text variant="p14SemiBold">Ages</Text>
              <Box flexDirection="row" flexWrap="wrap" gap="s">
                {AGE_BANDS.map((band) => (
                  <Chip
                    key={band}
                    label={band}
                    selected={ages.includes(band)}
                    onPress={() =>
                      setAges((a) =>
                        a.includes(band) ? a.filter((x) => x !== band) : [...a, band]
                      )
                    }
                  />
                ))}
              </Box>
            </Box>
          ) : null}
          <TextField
            label="About the children"
            icon="happy-outline"
            placeholder="Names, routines, allergies, what they love…"
            value={description}
            onChangeText={setDescription}
            textArea
          />
          <TextField
            label="Special instructions"
            icon="information-circle-outline"
            placeholder="Bedtime, pick-ups, house rules… (optional)"
            value={instructions}
            onChangeText={setInstructions}
            textArea
          />
        </Section>

        <Section title="Where">
          <TextField
            label="Area"
            icon="location-outline"
            placeholder="City, State"
            value={location}
            onChangeText={(v) => {
              setLocation(v);
              setErrors((e) => ({ ...e, location: undefined }));
            }}
            error={errors.location}
            helper="Shown to sitters before they accept."
          />
          <TextField
            label="Address"
            icon="home-outline"
            placeholder="Street address"
            value={address}
            onChangeText={setAddress}
            helper="Only shared with the sitter once the booking is confirmed."
          />
          <TextField
            label="ZIP code"
            icon="navigate-outline"
            placeholder="10001"
            value={zip}
            onChangeText={setZip}
            keyboardType="number-pad"
          />
        </Section>

        <Section title="Pay">
          <TextField
            label="Amount for the sitter"
            icon="cash-outline"
            placeholder={suggested ? String(suggested) : '0.00'}
            value={amountTouched ? amountText : suggested ? String(suggested) : ''}
            onChangeText={(v) => {
              setAmountTouched(true);
              setAmountText(v.replace(/[^0-9.]/g, ''));
              setErrors((e) => ({ ...e, amount: undefined }));
            }}
            error={errors.amount}
            keyboardType="decimal-pad"
            helper={
              sitterRate
                ? `Suggested from ${params.sitterName}'s rate. A small service fee is added when the sitter accepts.`
                : 'The total you’ll pay the sitter for this booking. A small service fee is added when a sitter accepts.'
            }
            trailing={
              <Text variant="p14Medium" color="textMuted">
                USD
              </Text>
            }
          />
        </Section>
      </KeyboardScreen>
      {sheet.element}
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInUp.duration(400)}>
      <Box gap="m">
        <Text variant="overline">{title}</Text>
        {children}
      </Box>
    </Animated.View>
  );
}
