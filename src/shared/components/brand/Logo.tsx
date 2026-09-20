import { Ionicons } from '@expo/vector-icons';

import { Box, Text } from '@/shared/components/ui';
import { useTheme, type ThemeColor } from '@/shared/theme';

export type LogoProps = {
  size?: number;
  /** `onPrimary` when the mark sits on a violet surface. */
  tone?: 'primary' | 'onPrimary';
  /** Render the wordmark next to the mark. */
  wordmark?: boolean;
};

/** QuickWatch mark: a rounded violet tile with a white "Q" and an eye glyph, from the app icon. */
export function Logo({ size = 44, tone = 'primary', wordmark = false }: LogoProps) {
  const { colors } = useTheme();
  const tile: ThemeColor = tone === 'primary' ? 'primary' : 'white';
  const glyph = tone === 'primary' ? colors.onPrimary : colors.primary;

  return (
    <Box flexDirection="row" alignItems="center" gap="sm">
      <Box
        width={size}
        height={size}
        borderRadius="l"
        backgroundColor={tile}
        alignItems="center"
        justifyContent="center"
        style={{ borderRadius: size * 0.28 }}>
        <Text
          style={{
            fontFamily: 'PlusJakartaSans_800ExtraBold',
            fontSize: size * 0.58,
            lineHeight: size * 0.7,
            color: glyph,
          }}>
          Q
        </Text>
        <Box position="absolute" bottom={size * 0.12} right={size * 0.12}>
          <Ionicons name="eye" size={size * 0.24} color={glyph} />
        </Box>
      </Box>
      {wordmark ? (
        <Text variant="h2" color={tone === 'primary' ? 'text' : 'onPrimary'}>
          QuickWatch
        </Text>
      ) : null}
    </Box>
  );
}
