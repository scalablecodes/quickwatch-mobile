import { Ionicons } from '@expo/vector-icons';
import type { PressableProps } from 'react-native';

import { useTheme, type ThemeColor } from '@/shared/theme';

import { Box } from './Box';
import type { IoniconName } from './Button';
import { Pressable } from './Pressable';

export type IconButtonProps = Omit<PressableProps, 'style'> & {
  icon: IoniconName;
  accessibilityLabel: string;
  size?: number;
  iconSize?: number;
  backgroundColor?: ThemeColor;
  color?: ThemeColor;
  /** Show a small dot (e.g. unread indicator) on the top-right. */
  badge?: boolean;
};

/** Round icon button on a soft well — headers, list rows, chat send. */
export function IconButton({
  icon,
  size = 44,
  iconSize = 22,
  backgroundColor = 'cardBackgroundSubtle',
  color = 'text',
  badge = false,
  ...rest
}: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" pressScale={0.9} hitSlop={6} {...rest}>
      <Box
        width={size}
        height={size}
        borderRadius="full"
        backgroundColor={backgroundColor}
        alignItems="center"
        justifyContent="center">
        <Ionicons name={icon} size={iconSize} color={colors[color]} />
        {badge ? (
          <Box
            position="absolute"
            top={9}
            right={9}
            width={9}
            height={9}
            borderRadius="full"
            backgroundColor="accent"
            borderWidth={1.5}
            borderColor="cardBackground"
          />
        ) : null}
      </Box>
    </Pressable>
  );
}
