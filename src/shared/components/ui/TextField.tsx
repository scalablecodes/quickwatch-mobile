import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputProps } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

import { Box } from './Box';
import type { IoniconName } from './Button';
import { Text } from './Text';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label?: string;
  /** Leading Ionicon; tinted grey when empty, brand colour once the field has a value. */
  icon?: IoniconName;
  trailingIcon?: IoniconName;
  onTrailingIconPress?: () => void;
  trailingIconAccessibilityLabel?: string;
  /** Custom trailing element (e.g. a unit label). Takes precedence over `trailingIcon`. */
  trailing?: ReactNode;
  /** Validation message; turns the frame red. */
  error?: string;
  helper?: string;
  /** Multi-line text area. */
  textArea?: boolean;
};

const FIELD_HEIGHT = 54;
const AREA_HEIGHT = 120;
const ICON_SIZE = 20;
const FOCUS_MS = 180;

/**
 * Labelled input. Idle: soft fill. Focused: white fill, brand border.
 * Filled: white fill, hairline, brand-tinted glyph. Error: danger border.
 */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  {
    label,
    icon,
    trailingIcon,
    onTrailingIconPress,
    trailingIconAccessibilityLabel,
    trailing,
    error,
    helper,
    textArea = false,
    value,
    onFocus,
    onBlur,
    editable = true,
    ...rest
  },
  ref
) {
  const { colors, textVariants, borderRadii } = useTheme();
  const [focused, setFocused] = useState(false);
  const filled = Boolean(value);

  // 0 idle → 1 filled → 2 focused → 3 error, so error always wins.
  const state = useDerivedValue(
    () => withTiming(error ? 3 : focused ? 2 : filled ? 1 : 0, { duration: FOCUS_MS }),
    [error, focused, filled]
  );
  const frameStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      state.value,
      [0, 1, 2, 3],
      [colors.inputBackground, colors.cardBackground, colors.cardBackground, colors.cardBackground]
    ),
    borderColor: interpolateColor(
      state.value,
      [0, 1, 2, 3],
      [colors.inputBorder, colors.inputBorderFilled, colors.primary, colors.danger]
    ),
  }));

  const glyphTint = error ? colors.danger : filled || focused ? colors.primary : colors.textHint;
  const inputFont = {
    fontFamily: textVariants.p16.fontFamily,
    fontSize: textVariants.p16.fontSize,
    color: colors.text,
  };

  return (
    <Box gap="s" alignSelf="stretch">
      {label ? <Text variant="p14SemiBold">{label}</Text> : null}
      <Animated.View
        style={[
          styles.frame,
          textArea ? styles.area : styles.single,
          { borderRadius: borderRadii.field },
          !editable && styles.readonly,
          frameStyle,
        ]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={ICON_SIZE}
            color={glyphTint}
            style={textArea && styles.areaIcon}
          />
        ) : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label ?? rest.placeholder}
          value={value}
          editable={editable}
          placeholderTextColor={colors.textHint}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          multiline={textArea}
          textAlignVertical={textArea ? 'top' : 'center'}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, textArea && styles.areaInput, inputFont]}
          {...rest}
        />
        {trailing ??
          (trailingIcon ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={trailingIconAccessibilityLabel}
              disabled={!onTrailingIconPress}
              onPress={onTrailingIconPress}
              hitSlop={12}>
              <Ionicons name={trailingIcon} size={ICON_SIZE} color={colors.textHint} />
            </Pressable>
          ) : null)}
      </Animated.View>
      {error ? (
        <Text variant="p12Medium" color="danger">
          {error}
        </Text>
      ) : helper ? (
        <Text variant="p12" color="textMuted">
          {helper}
        </Text>
      ) : null}
    </Box>
  );
});

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  single: { height: FIELD_HEIGHT },
  area: { minHeight: AREA_HEIGHT, alignItems: 'flex-start', paddingVertical: 14 },
  areaIcon: { marginTop: 2 },
  readonly: { opacity: 0.7 },
  input: { flex: 1, height: '100%', paddingVertical: 0 },
  areaInput: { height: undefined, minHeight: AREA_HEIGHT - 28 },
});
