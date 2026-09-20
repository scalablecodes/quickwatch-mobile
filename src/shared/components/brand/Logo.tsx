import { Box, Text } from '@/shared/components/ui';
import { useTheme, type ThemeColor } from '@/shared/theme';

export type LogoProps = {
  size?: number;
  /** `onPrimary` when the mark sits on a violet surface. */
  tone?: 'primary' | 'onPrimary';
  /** Render the wordmark next to the mark. */
  wordmark?: boolean;
};

/**
 * QuickWatch mark, matching `assets/splash-icon.png`: a rounded tile with a "Q" and the
 * gold "watch" eye at the bottom-right.
 */
export function Logo({ size = 44, tone = 'primary', wordmark = false }: LogoProps) {
  const { colors } = useTheme();
  const tile: ThemeColor = tone === 'primary' ? 'primary' : 'white';
  const glyph = tone === 'primary' ? colors.onPrimary : colors.primary;
  const eye = size * 0.3;

  return (
    <Box flexDirection="row" alignItems="center" gap="sm">
      <Box
        width={size}
        height={size}
        backgroundColor={tile}
        alignItems="center"
        justifyContent="center"
        style={{ borderRadius: size * 0.28 }}>
        <Text
          style={{
            fontFamily: 'PlusJakartaSans_800ExtraBold',
            fontSize: size * 0.6,
            lineHeight: size * 0.72,
            color: glyph,
            marginTop: -size * 0.03,
            marginLeft: -size * 0.04,
          }}>
          Q
        </Text>
        <Box
          position="absolute"
          backgroundColor={tile}
          alignItems="center"
          justifyContent="center"
          style={{
            right: size * 0.08,
            bottom: size * 0.08,
            width: eye,
            height: eye,
            borderRadius: eye / 2,
          }}>
          <Box
            backgroundColor="accent"
            alignItems="center"
            justifyContent="center"
            style={{ width: eye * 0.8, height: eye * 0.8, borderRadius: eye * 0.4 }}>
            <Box
              backgroundColor={tile}
              style={{ width: eye * 0.34, height: eye * 0.34, borderRadius: eye * 0.17 }}
            />
          </Box>
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
