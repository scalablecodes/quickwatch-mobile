import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { useTheme } from '@/shared/theme';

import { Box } from './Box';

export type StarsProps = {
  value: number;
  size?: number;
  /** When set, stars become tappable. */
  onChange?: (value: number) => void;
};

/** Five-star rating, read-only or interactive. */
export function Stars({ value, size = 16, onChange }: StarsProps) {
  const { colors } = useTheme();
  return (
    <Box
      flexDirection="row"
      gap="xxs"
      accessibilityRole="adjustable"
      accessibilityValue={{ now: value }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value >= star;
        const half = !filled && value >= star - 0.5;
        const icon = filled ? 'star' : half ? 'star-half' : 'star-outline';
        const glyph = (
          <Ionicons
            name={icon}
            size={size}
            color={filled || half ? colors.rating : colors.borderStrong}
          />
        );
        return onChange ? (
          <Pressable
            key={star}
            accessibilityRole="button"
            accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
            hitSlop={4}
            onPress={() => onChange(star)}>
            {glyph}
          </Pressable>
        ) : (
          <Box key={star}>{glyph}</Box>
        );
      })}
    </Box>
  );
}
