import { Ionicons } from '@expo/vector-icons';

import { Box, Pressable, Text, type IoniconName } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

export type RoleCardProps = {
  title: string;
  description: string;
  icon: IoniconName;
  selected: boolean;
  onPress: () => void;
};

/** Large selectable card for choosing between parent and babysitter. */
export function RoleCard({ title, description, icon, selected, onPress }: RoleCardProps) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress}>
      <Box
        flexDirection="row"
        alignItems="center"
        gap="m"
        padding="m"
        borderRadius="xl"
        borderWidth={2}
        borderColor={selected ? 'primary' : 'border'}
        backgroundColor={selected ? 'primaryTint' : 'cardBackground'}>
        <Box
          width={52}
          height={52}
          borderRadius="l"
          backgroundColor={selected ? 'primary' : 'primarySoft'}
          alignItems="center"
          justifyContent="center">
          <Ionicons name={icon} size={26} color={selected ? colors.onPrimary : colors.primary} />
        </Box>
        <Box flex={1} gap="xxs">
          <Text variant="h4">{title}</Text>
          <Text variant="p12" color="textSecondary">
            {description}
          </Text>
        </Box>
        <Ionicons
          name={selected ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={selected ? colors.primary : colors.textHint}
        />
      </Box>
    </Pressable>
  );
}
