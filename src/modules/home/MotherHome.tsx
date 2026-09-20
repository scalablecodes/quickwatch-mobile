import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingCard } from '@/modules/bookings/components/BookingCard';
import { matchesFilter } from '@/modules/bookings/lib/status';
import { useMyBookings } from '@/modules/bookings/queries';
import { SitterCard } from '@/modules/sitters/components/SitterCard';
import { useSitters } from '@/modules/sitters/queries';
import { useTabBarInset } from '@/shared/components/AppTabs';
import { useDateTimeSheet } from '@/shared/components/DateTimeSheet';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Box, Button, Card, Pressable, ScrollBox, Skeleton, Text } from '@/shared/components/ui';
import { formatClock, formatDay, toDateKey } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

import { HomeHeader } from './HomeHeader';

/** Parent dashboard: search for care, next booking, sitters available now. */
export function MotherHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const { colors } = useTheme();
  const sheet = useDateTimeSheet();

  const bookings = useMyBookings();
  const sitters = useSitters({});
  const [date, setDate] = useState<Date | null>(null);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const next = (bookings.data ?? [])
    .filter((b) => matchesFilter(b, 'active') || matchesFilter(b, 'upcoming'))
    .sort((a, b) => (a.selectedStartDate < b.selectedStartDate ? -1 : 1))
    .slice(0, 2);
  const available = (sitters.data ?? []).filter((s) => s.available).slice(0, 8);

  const search = () =>
    router.push({
      pathname: '/sitter',
      params: {
        date: date ? toDateKey(date) : undefined,
        startTime: start ? formatClock(start) : undefined,
        endTime: end ? formatClock(end) : undefined,
      },
    });

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScrollBox
        flex={1}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: bottomInset,
          gap: 22,
        }}
        refreshControl={
          <RefreshControl
            refreshing={bookings.isRefetching}
            onRefresh={() => {
              bookings.refetch();
              sitters.refetch();
            }}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}>
        <HomeHeader />

        <Animated.View entering={FadeInDown.duration(450)}>
          <Box borderRadius="sheet" overflow="hidden">
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Box padding="ml" gap="m">
              <Box gap="xxs">
                <Text variant="h2" color="onPrimary">
                  When do you need care?
                </Text>
                <Text variant="p14" color="onPrimaryMuted">
                  See who&apos;s free, then send a request.
                </Text>
              </Box>
              <Box flexDirection="row" gap="s">
                <SearchPill
                  icon="calendar-outline"
                  label={date ? formatDay(date) : 'Date'}
                  onPress={() =>
                    sheet.open({
                      mode: 'date',
                      title: 'Pick a date',
                      value: date ?? new Date(),
                      minimumDate: new Date(),
                      onChange: setDate,
                    })
                  }
                />
                <SearchPill
                  icon="time-outline"
                  label={start && end ? `${formatClock(start)} – ${formatClock(end)}` : 'Time'}
                  onPress={() =>
                    sheet.open({
                      mode: 'time',
                      title: 'From',
                      value: start ?? new Date(),
                      onChange: (d) => {
                        setStart(d);
                        sheet.open({
                          mode: 'time',
                          title: 'Until',
                          value: end ?? d,
                          onChange: setEnd,
                        });
                      },
                    })
                  }
                />
              </Box>
              <Button variant="accent" icon="search" onPress={search}>
                Find a sitter
              </Button>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/booking/new')}
                style={styles.openRequest}>
                <Ionicons name="megaphone-outline" size={16} color={colors.onPrimary} />
                <Text variant="p14SemiBold" color="onPrimary">
                  Or post an open request
                </Text>
                <Ionicons name="arrow-forward" size={14} color={colors.onPrimary} />
              </Pressable>
            </Box>
          </Box>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <Box gap="sm">
            <SectionHeader
              title="Your bookings"
              actionLabel="See all"
              onAction={() => router.push('/bookings')}
            />
            {bookings.isLoading ? (
              <Skeleton height={132} radius={20} />
            ) : next.length ? (
              next.map((b) => <BookingCard key={b._id} booking={b} viewer="Mother" />)
            ) : (
              <Card variant="subtle" flexDirection="row" alignItems="center" gap="sm">
                <Ionicons name="calendar-outline" size={22} color={colors.textMuted} />
                <Text variant="p14" color="textSecondary" style={{ flex: 1 }}>
                  No upcoming bookings. Find a sitter to get started.
                </Text>
              </Card>
            )}
          </Box>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(450)}>
          <Box gap="sm">
            <SectionHeader
              title="Available now"
              actionLabel="Browse all"
              onAction={() => router.push('/sitter')}
            />
            {sitters.isLoading ? (
              <Box flexDirection="row" gap="sm">
                {[0, 1].map((i) => (
                  <Skeleton key={i} width={150} height={150} radius={20} />
                ))}
              </Box>
            ) : available.length ? (
              <FlatList
                horizontal
                data={available}
                keyExtractor={(s) => s._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
                style={styles.bleed}
                renderItem={({ item }) => <SitterCard sitter={item} compact />}
              />
            ) : (
              <Card variant="subtle">
                <Text variant="p14" color="textSecondary">
                  No sitters are free right now. Try searching by date.
                </Text>
              </Card>
            )}
          </Box>
        </Animated.View>
      </ScrollBox>
      {sheet.element}
    </Box>
  );
}

function SearchPill({
  icon,
  label,
  onPress,
}: {
  icon: 'calendar-outline' | 'time-outline';
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.pill}>
      <Box
        flexDirection="row"
        alignItems="center"
        gap="s"
        backgroundColor="overlaySoft"
        borderRadius="full"
        height={44}
        paddingHorizontal="m"
        borderWidth={1}
        borderColor="overlayBorder">
        <Ionicons name={icon} size={16} color={colors.onPrimary} />
        <Text variant="p14Medium" color="onPrimary" numberOfLines={1} style={{ flex: 1 }}>
          {label}
        </Text>
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { flex: 1 },
  openRequest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  bleed: { marginHorizontal: -20, paddingHorizontal: 20 },
});
