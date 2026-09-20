import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, type PressableProps } from 'react-native';

import { useTheme, type ThemeColor } from '@/shared/theme';

import { Box } from './Box';
import { Pressable } from './Pressable';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
type Size = 'lg' | 'md' | 'sm';
export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  children?: string;
  variant?: Variant;
  size?: Size;
  /** Leading Ionicon. */
  icon?: IoniconName;
  /** Trailing Ionicon. */
  trailingIcon?: IoniconName;
  loading?: boolean;
  /** Stretch to the container width (default) or hug content. */
  fullWidth?: boolean;
  /** Light haptic tick on press (default on for primary/accent/danger). */
  haptic?: boolean;
};

const variants: Record<
  Variant,
  { bg: ThemeColor; border: ThemeColor; label: ThemeColor; borderWidth: number }
> = {
  primary: { bg: 'primary', border: 'primary', label: 'onPrimary', borderWidth: 0 },
  accent: { bg: 'accent', border: 'accent', label: 'onAccent', borderWidth: 0 },
  secondary: { bg: 'primarySoft', border: 'primarySoft', label: 'primary', borderWidth: 0 },
  outline: { bg: 'transparent', border: 'borderStrong', label: 'text', borderWidth: 1.5 },
  ghost: { bg: 'transparent', border: 'transparent', label: 'primary', borderWidth: 0 },
  danger: { bg: 'dangerSoft', border: 'dangerSoft', label: 'danger', borderWidth: 0 },
};

const sizes: Record<Size, { height: number; paddingH: 'l' | 'm' | 'sm'; icon: number }> = {
  lg: { height: 56, paddingH: 'l', icon: 20 },
  md: { height: 48, paddingH: 'm', icon: 18 },
  sm: { height: 38, paddingH: 'sm', icon: 16 },
};

/** Pill button. Springs on press, dims when disabled, swaps the label for a spinner when loading. */
export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  icon,
  trailingIcon,
  loading = false,
  fullWidth = true,
  disabled,
  haptic,
  onPress,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const v = variants[variant];
  const s = sizes[size];
  const isDisabled = disabled || loading;
  const shouldHaptic =
    haptic ?? (variant === 'primary' || variant === 'accent' || variant === 'danger');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel ?? children}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={(e) => {
        if (shouldHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.(e);
      }}
      style={[fullWidth ? styles.full : styles.hug, disabled && !loading && styles.disabled]}
      {...rest}>
      <Box
        height={s.height}
        borderRadius="full"
        backgroundColor={v.bg}
        borderColor={v.border}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="s"
        paddingHorizontal={s.paddingH}
        style={{ borderWidth: v.borderWidth }}>
        {loading ? (
          <ActivityIndicator color={colors[v.label]} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={s.icon} color={colors[v.label]} /> : null}
            {children ? (
              <Text variant={size === 'sm' ? 'p14SemiBold' : 'p16SemiBold'} color={v.label}>
                {children}
              </Text>
            ) : null}
            {trailingIcon ? (
              <Ionicons name={trailingIcon} size={s.icon} color={colors[v.label]} />
            ) : null}
          </>
        )}
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  full: { alignSelf: 'stretch' },
  hug: { alignSelf: 'flex-start' },
  disabled: { opacity: 0.5 },
});
