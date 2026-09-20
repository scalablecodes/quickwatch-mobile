import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SitterCard } from '@/modules/sitters/components/SitterCard';
import { useSitters } from '@/modules/sitters/queries';
import { useDateTimeSheet } from '@/shared/components/DateTimeSheet';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { Box, Button, Chip, EmptyState, Skeleton, TextField } from '@/shared/components/ui';
import { formatClock, formatDay, parseDate, toDateKey } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

type Sort = 'rating' | 'price';

/** Browse approved sitters, filtered by date/time window and area, sorted by rating or price. */
export function FindSittersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    date?: string;
    startTime?: string;
    endTime?: string;
    city?: string;
  }>();
  const sheet = useDateTimeSheet();

  const [date, setDate] = useState<Date | null>(() => parseDate(params.date) ?? null);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [search, setSearch] = useState(params.city ?? '');
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [sort, setSort] = useState<Sort>('rating');

  const filters = useMemo(
    () => ({
      date: date ? toDateKey(date) : undefined,
      startTime: start ? formatClock(start) : params.startTime,
      endTime: end ? formatClock(end) : params.endTime,
    }),
    [date, start, end, params.startTime, params.endTime]
  );
  const { data, isLoading, refetch, isRefetching } = useSitters(filters);

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = data ?? [];
    if (q)
      list = list.filter((s) =>
        [s.FirstName, s.LastName, s.city, s.state, s.zipCode].some((v) =>
          v?.toLowerCase().includes(q)
        )
      );
    if (onlyAvailable) list = list.filter((s) => s.available);
    return [...list].sort((a, b) =>
      sort === 'rating'
        ? b.ratingAverage - a.ratingAverage || b.ratingCount - a.ratingCount
        : (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0)
    );
  }, [data, search, onlyAvailable, sort]);

  const timeLabel =
    filters.startTime && filters.endTime ? `${filters.startTime} – ${filters.endTime}` : 'Any time';

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title="Find a sitter" />
      <Box paddingHorizontal="ml" gap="sm" paddingBottom="sm">
        <TextField
          icon="search-outline"
          placeholder="Search by name, city or ZIP"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[0]}
          keyExtractor={() => 'chips'}
          renderItem={() => (
            <Box flexDirection="row" gap="s">
              <Chip
                icon="calendar-outline"
                label={date ? formatDay(date) : 'Any date'}
                selected={Boolean(date)}
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
              <Chip
                icon="time-outline"
                label={timeLabel}
                selected={Boolean(filters.startTime)}
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
              <Chip
                icon="checkmark-circle-outline"
                label="Available"
                selected={onlyAvailable}
                onPress={() => setOnlyAvailable((v) => !v)}
              />
              <Chip
                icon={sort === 'rating' ? 'star-outline' : 'cash-outline'}
                label={sort === 'rating' ? 'Top rated' : 'Lowest price'}
                selected
                onPress={() => setSort((s) => (s === 'rating' ? 'price' : 'rating'))}
              />
              {date || start ? (
                <Chip
                  icon="close"
                  label="Clear"
                  onPress={() => {
                    setDate(null);
                    setStart(null);
                    setEnd(null);
                  }}
                />
              ) : null}
            </Box>
          )}
        />
      </Box>
      {isLoading ? (
        <Box paddingHorizontal="ml" gap="sm">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={112} radius={20} />
          ))}
        </Box>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(s) => s._id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 24,
            gap: 12,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(Math.min(index, 6) * 50).duration(350)}
              layout={LinearTransition}>
              <SitterCard sitter={item} />
            </Animated.View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No sitters match"
              message="Try another date, widen your search, or post an open request that any sitter can accept."
              action={
                <Button
                  size="md"
                  fullWidth={false}
                  icon="megaphone-outline"
                  onPress={() =>
                    router.push({
                      pathname: '/booking/new',
                      params: {
                        date: filters.date,
                        startTime: filters.startTime,
                        endTime: filters.endTime,
                      },
                    })
                  }>
                  Post an open request
                </Button>
              }
            />
          }
        />
      )}
      {sheet.element}
    </Box>
  );
}
