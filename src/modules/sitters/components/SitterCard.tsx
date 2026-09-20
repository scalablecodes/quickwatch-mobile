import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type { Sitter } from '@/modules/sitters/types';
import { Avatar, Box, Card, Pressable, StatusPill, Text } from '@/shared/components/ui';
import { formatMoney, fullName } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

export type SitterCardProps = {
  sitter: Sitter;
  /** Compact horizontal-scroll variant used on Home. */
  compact?: boolean;
};

/** Sitter summary: photo, name, area, rating, rate and availability. */
export function SitterCard({ sitter, compact = false }: SitterCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const name = fullName(sitter);
  const area = [sitter.city, sitter.state].filter(Boolean).join(', ');

  const open = () => router.push({ pathname: '/sitter/[id]', params: { id: sitter._id } });

  if (compact) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={open}>
        <Card variant="elevated" width={150} gap="s" alignItems="center" padding="sm">
          <Avatar uri={sitter.picture} name={name} size={64} />
          <Box alignItems="center" gap="xxs">
            <Text variant="p14SemiBold" numberOfLines={1}>
              {name}
            </Text>
            <Box flexDirection="row" alignItems="center" gap="xxs">
              <Ionicons name="star" size={12} color={colors.rating} />
              <Text variant="p12Medium">
                {sitter.ratingCount ? sitter.ratingAverage.toFixed(1) : 'New'}
              </Text>
              <Text variant="p12" color="textMuted">
                · {formatMoney(sitter.hourlyRate)}/hr
              </Text>
            </Box>
          </Box>
        </Card>
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={open}>
      <Card variant="elevated" flexDirection="row" gap="sm" alignItems="center">
        <Avatar uri={sitter.picture} name={name} size={64} />
        <Box flex={1} gap="xxs">
          <Box flexDirection="row" alignItems="center" gap="s">
            <Text variant="h4" numberOfLines={1} style={{ flexShrink: 1 }}>
              {name}
            </Text>
            <StatusPill
              label={sitter.available ? 'Available' : 'Booked'}
              tone={sitter.available ? 'success' : 'neutral'}
            />
          </Box>
          {area ? (
            <Box flexDirection="row" alignItems="center" gap="xxs">
              <Ionicons name="location-outline" size={13} color={colors.textMuted} />
              <Text variant="p12" color="textMuted" numberOfLines={1}>
                {area}
              </Text>
            </Box>
          ) : null}
          {sitter.about ? (
            <Text variant="p12" color="textSecondary" numberOfLines={2}>
              {sitter.about}
            </Text>
          ) : null}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginTop="xxs">
            <Box flexDirection="row" alignItems="center" gap="xxs">
              <Ionicons name="star" size={14} color={colors.rating} />
              <Text variant="p12SemiBold">
                {sitter.ratingCount ? sitter.ratingAverage.toFixed(1) : 'New'}
              </Text>
              {sitter.ratingCount ? (
                <Text variant="p12" color="textMuted">
                  ({sitter.ratingCount})
                </Text>
              ) : null}
            </Box>
            <Text variant="p14Bold" color="primary">
              {formatMoney(sitter.hourlyRate)}
              <Text variant="p12" color="textMuted">
                /hr
              </Text>
            </Text>
          </Box>
        </Box>
      </Card>
    </Pressable>
  );
}
