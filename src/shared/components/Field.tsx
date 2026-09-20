import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';

import { Box, Pressable, Text, type IoniconName } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

export type PickerFieldProps = {
  label?: string;
  icon?: IoniconName;
  /** Current value text; placeholder styling when empty. */
  value?: string;
  placeholder: string;
  onPress: () => void;
  error?: string;
  trailing?: ReactNode;
};

/** Looks like a `TextField` but opens a picker (date, time, options) on tap. */
export function PickerField({
  label,
  icon,
  value,
  placeholder,
  onPress,
  error,
  trailing,
}: PickerFieldProps) {
  const { colors } = useTheme();
  const filled = Boolean(value);
  return (
    <Box gap="s" alignSelf="stretch">
      {label ? <Text variant="p14SemiBold">{label}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        pressScale={0.99}
        onPress={onPress}>
        <Box
          height={54}
          borderRadius="field"
          borderWidth={1.5}
          borderColor={error ? 'danger' : filled ? 'inputBorderFilled' : 'inputBorder'}
          backgroundColor={filled ? 'cardBackground' : 'inputBackground'}
          paddingHorizontal="m"
          flexDirection="row"
          alignItems="center"
          gap="sm">
          {icon ? (
            <Ionicons
              name={icon}
              size={20}
              color={error ? colors.danger : filled ? colors.primary : colors.textHint}
            />
          ) : null}
          <Text
            variant="p16"
            color={filled ? 'text' : 'textHint'}
            style={{ flex: 1 }}
            numberOfLines={1}>
            {value || placeholder}
          </Text>
          {trailing ?? <Ionicons name="chevron-down" size={18} color={colors.textHint} />}
        </Box>
      </Pressable>
      {error ? (
        <Text variant="p12Medium" color="danger">
          {error}
        </Text>
      ) : null}
    </Box>
  );
}

export type OptionSheetProps<T extends string> = {
  options: { value: T; label: string; icon?: IoniconName }[];
  value?: T;
  onChange: (value: T) => void;
};

/** Inline option list used inside a form sheet (gender, child age bands). */
export function OptionList<T extends string>({ options, value, onChange }: OptionSheetProps<T>) {
  const { colors } = useTheme();
  return (
    <Box gap="s">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            pressScale={0.98}
            onPress={() => onChange(option.value)}>
            <Box
              flexDirection="row"
              alignItems="center"
              gap="sm"
              padding="m"
              borderRadius="l"
              borderWidth={1.5}
              borderColor={selected ? 'primary' : 'border'}
              backgroundColor={selected ? 'primaryTint' : 'cardBackground'}>
              {option.icon ? (
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={selected ? colors.primary : colors.textSecondary}
                />
              ) : null}
              <Text variant="p16Medium" color={selected ? 'primary' : 'text'} style={{ flex: 1 }}>
                {option.label}
              </Text>
              <Ionicons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={selected ? colors.primary : colors.textHint}
              />
            </Box>
          </Pressable>
        );
      })}
    </Box>
  );
}
