import { Ionicons } from '@expo/vector-icons';

import { Box, Pressable, Text } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

export type StepperProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

/** "− 2 +" numeric stepper row. */
export function Stepper({ label, value, min = 0, max = 10, onChange }: StepperProps) {
  const { colors } = useTheme();
  const btn = (icon: 'remove' | 'add', disabled: boolean, next: number) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={icon === 'add' ? 'Increase' : 'Decrease'}
      pressScale={0.9}
      disabled={disabled}
      onPress={() => onChange(next)}>
      <Box
        width={36}
        height={36}
        borderRadius="full"
        backgroundColor={disabled ? 'cardBackgroundSubtle' : 'primarySoft'}
        alignItems="center"
        justifyContent="center">
        <Ionicons name={icon} size={18} color={disabled ? colors.textHint : colors.primary} />
      </Box>
    </Pressable>
  );
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="cardBackground"
      borderRadius="field"
      borderWidth={1.5}
      borderColor="inputBorderFilled"
      paddingHorizontal="m"
      height={54}>
      <Text variant="p16Medium">{label}</Text>
      <Box flexDirection="row" alignItems="center" gap="sm">
        {btn('remove', value <= min, value - 1)}
        <Text variant="h3" style={{ minWidth: 22, textAlign: 'center' }}>
          {value}
        </Text>
        {btn('add', value >= max, value + 1)}
      </Box>
    </Box>
  );
}
