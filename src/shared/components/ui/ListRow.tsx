import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';

import { useTheme, type ThemeColor } from '@/shared/theme';

import { Box } from './Box';
import type { IoniconName } from './Button';
import { Pressable } from './Pressable';
import { Text } from './Text';

export type ListRowProps = Omit<PressableProps, 'style'> & {
  icon: IoniconName;
  title: string;
  subtitle?: string;
  iconColor?: ThemeColor;
  iconBackground?: ThemeColor;
  /** Trailing element; defaults to a chevron when `onPress` is set. */
  trailing?: ReactNode;
  /** Danger tint for destructive rows (sign out, delete). */
  destructive?: boolean;
};

/** Settings-style row: tinted icon well, title/subtitle, chevron. */
export function ListRow({
  icon,
  title,
  subtitle,
  iconColor,
  iconBackground,
  trailing,
  destructive = false,
  onPress,
  ...rest
}: ListRowProps) {
  const { colors } = useTheme();
  const fg: ThemeColor = destructive ? 'danger' : (iconColor ?? 'primary');
  const bg: ThemeColor = destructive ? 'dangerSoft' : (iconBackground ?? 'primarySoft');

  return (
    <Pressable
      accessibilityRole="button"
      pressScale={0.99}
      onPress={onPress}
      disabled={!onPress}
      {...rest}>
      <Box flexDirection="row" alignItems="center" gap="sm" paddingVertical="sm">
        <Box
          width={40}
          height={40}
          borderRadius="m"
          backgroundColor={bg}
          alignItems="center"
          justifyContent="center">
          <Ionicons name={icon} size={20} color={colors[fg]} />
        </Box>
        <Box flex={1} gap="xxs">
          <Text variant="p16Medium" color={destructive ? 'danger' : 'text'}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="p12" color="textMuted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </Box>
        {trailing ??
          (onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textHint} /> : null)}
      </Box>
    </Pressable>
  );
}
