import { Ionicons } from '@expo/vector-icons';
import type { PressableProps } from 'react-native';

import { useTheme } from '@/shared/theme';

import { Box } from './Box';
import type { IoniconName } from './Button';
import { Pressable } from './Pressable';
import { Text } from './Text';

export type ChipProps = Omit<PressableProps, 'style'> & {
  label: string;
  selected?: boolean;
  icon?: IoniconName;
};

/** Selectable pill — filters, quick options. */
export function Chip({ label, selected = false, icon, ...rest }: ChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      pressScale={0.95}
      {...rest}>
      <Box
        flexDirection="row"
        alignItems="center"
        gap="xs"
        paddingHorizontal="m"
        height={38}
        borderRadius="full"
        backgroundColor={selected ? 'primary' : 'cardBackgroundSubtle'}
        borderWidth={1}
        borderColor={selected ? 'primary' : 'border'}>
        {icon ? (
          <Ionicons
            name={icon}
            size={15}
            color={selected ? colors.onPrimary : colors.textSecondary}
          />
        ) : null}
        <Text variant="p14Medium" color={selected ? 'onPrimary' : 'textSecondary'}>
          {label}
        </Text>
      </Box>
    </Pressable>
  );
}
