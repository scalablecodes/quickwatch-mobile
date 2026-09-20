import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReviewRow } from '@/modules/reviews/components/ReviewRow';
import { useSitterReviews } from '@/modules/reviews/queries';
import { useSitter } from '@/modules/sitters/queries';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import {
  Avatar,
  Box,
  Button,
  Card,
  ScrollBox,
  Skeleton,
  Stars,
  StatusPill,
  Text,
  type IoniconName,
} from '@/shared/components/ui';
import { formatDay, formatMoney, fullName } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

/** A sitter's public profile: bio, rate, availability, reviews, and the Book CTA. */
export function SitterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { sitter, isLoading } = useSitter(id);
  const reviews = useSitterReviews(id);

  if (!sitter) {
    return (
      <Box flex={1} backgroundColor="screenBackground">
        <ScreenHeader />
        {isLoading ? (
          <Box padding="ml" gap="m" alignItems="center">
            <Skeleton height={112} circle />
            <Skeleton width={180} height={24} />
            <Skeleton height={120} radius={20} />
          </Box>
        ) : (
          <Box padding="ml">
            <Text color="textSecondary">This sitter is no longer listed.</Text>
          </Box>
        )}
      </Box>
    );
  }

  const name = fullName(sitter);
  const area = [sitter.city, sitter.state].filter(Boolean).join(', ');
  const upcoming = sitter.bookedSlots
    .filter((s) => s.date >= new Date().toISOString().slice(0, 10))
    .slice(0, 4);

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader />
      <ScrollBox
        flex={1}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
          <Avatar uri={sitter.picture} name={name} size={112} ring />
          <Box alignItems="center" gap="xs">
            <Text variant="h1" textAlign="center">
              {name}
            </Text>
            {area ? (
              <Box flexDirection="row" alignItems="center" gap="xxs">
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text variant="p14" color="textMuted">
                  {area}
                </Text>
              </Box>
            ) : null}
            <StatusPill
              label={sitter.available ? 'Available now' : 'Booked right now'}
              tone={sitter.available ? 'success' : 'neutral'}
            />
          </Box>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(400)}>
          <Box flexDirection="row" gap="sm">
            <Stat
              icon="star"
              label="Rating"
              value={sitter.ratingCount ? sitter.ratingAverage.toFixed(1) : 'New'}
              tint="rating"
            />
            <Stat
              icon="chatbox-ellipses"
              label="Reviews"
              value={String(sitter.ratingCount)}
              tint="info"
            />
            <Stat
              icon="cash"
              label="Per hour"
              value={formatMoney(sitter.hourlyRate)}
              tint="success"
            />
          </Box>
        </Animated.View>

        {sitter.about ? (
          <Animated.View entering={FadeInUp.delay(140).duration(400)}>
            <Card gap="s">
              <Text variant="h4">About {sitter.FirstName}</Text>
              <Text variant="p14" color="textSecondary">
                {sitter.about}
              </Text>
            </Card>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Card gap="s">
            <Text variant="h4">Availability</Text>
            {upcoming.length === 0 ? (
              <Box flexDirection="row" alignItems="center" gap="s">
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text variant="p14" color="textSecondary">
                  No upcoming bookings — wide open.
                </Text>
              </Box>
            ) : (
              <Box gap="xs">
                <Text variant="p12" color="textMuted">
                  Already booked on:
                </Text>
                {upcoming.map((slot) => (
                  <Box key={slot.bookingId} flexDirection="row" alignItems="center" gap="s">
                    <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
                    <Text variant="p14Medium">{formatDay(slot.date)}</Text>
                    <Text variant="p14" color="textMuted">
                      {slot.startTime} – {slot.endTime}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(260).duration(400)}>
          <Card gap="m">
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text variant="h4">Reviews</Text>
              {sitter.ratingCount ? (
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Stars value={sitter.ratingAverage} size={14} />
                  <Text variant="p12SemiBold">{sitter.ratingAverage.toFixed(1)}</Text>
                </Box>
              ) : null}
            </Box>
            {reviews.isLoading ? (
              <Skeleton height={60} />
            ) : reviews.data?.reviews.length ? (
              reviews.data.reviews
                .slice(0, 10)
                .map((r) => (
                  <ReviewRow
                    key={r._id}
                    name={typeof r.mother === 'object' ? fullName(r.mother) : 'Parent'}
                    rating={r.rating}
                    comment={r.comment}
                    date={r.motherReviewedAt ?? r.createdAt}
                  />
                ))
            ) : (
              <Text variant="p14" color="textMuted">
                No reviews yet — be the first to book {sitter.FirstName}.
              </Text>
            )}
          </Card>
        </Animated.View>
      </ScrollBox>

      <Box
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        paddingHorizontal="ml"
        paddingTop="sm"
        backgroundColor="screenBackground"
        style={{ paddingBottom: insets.bottom + 12 }}>
        <Button
          icon="calendar"
          onPress={() =>
            router.push({
              pathname: '/booking/new',
              params: {
                sitterId: sitter._id,
                sitterName: name,
                sitterRate: String(sitter.hourlyRate ?? ''),
                sitterPicture: sitter.picture,
                sitterEmail: sitter.Email,
              },
            })
          }>
          {`Request ${sitter.FirstName}`}
        </Button>
      </Box>
    </Box>
  );
}

function Stat({
  icon,
  label,
  value,
  tint,
}: {
  icon: IoniconName;
  label: string;
  value: string;
  tint: 'rating' | 'info' | 'success';
}) {
  const { colors } = useTheme();
  return (
    <Card flex={1} alignItems="center" gap="xs" padding="sm">
      <Ionicons name={icon} size={20} color={colors[tint]} />
      <Text variant="h3">{value}</Text>
      <Text variant="micro">{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 12, paddingTop: 4 },
});
