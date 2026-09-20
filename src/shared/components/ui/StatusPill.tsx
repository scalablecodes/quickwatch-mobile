import type { ThemeColor } from '@/shared/theme';

import { Box } from './Box';
import { Text } from './Text';

export type StatusTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type StatusPillProps = {
  label: string;
  tone?: StatusTone;
  /** Solid fill instead of the soft tint. */
  solid?: boolean;
};

const tones: Record<StatusTone, { soft: ThemeColor; fg: ThemeColor; solid: ThemeColor }> = {
  neutral: { soft: 'cardBackgroundSubtle', fg: 'textSecondary', solid: 'textSecondary' },
  primary: { soft: 'primarySoft', fg: 'primary', solid: 'primary' },
  success: { soft: 'successSoft', fg: 'success', solid: 'success' },
  warning: { soft: 'warningSoft', fg: 'warning', solid: 'warning' },
  danger: { soft: 'dangerSoft', fg: 'danger', solid: 'danger' },
  info: { soft: 'infoSoft', fg: 'info', solid: 'info' },
};

/** Compact status label with a leading dot. */
export function StatusPill({ label, tone = 'neutral', solid = false }: StatusPillProps) {
  const t = tones[tone];
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      gap="xs"
      paddingHorizontal="s"
      paddingVertical="xxs"
      borderRadius="full"
      backgroundColor={solid ? t.solid : t.soft}
      alignSelf="flex-start">
      <Box width={6} height={6} borderRadius="full" backgroundColor={solid ? 'white' : t.fg} />
      <Text variant="p12SemiBold" color={solid ? 'white' : t.fg}>
        {label}
      </Text>
    </Box>
  );
}
