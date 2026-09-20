import type { PropsWithChildren } from 'react';
import { Pressable as RNPressable, type PressableProps as RNPressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export type PressableProps = Omit<RNPressableProps, 'style'> &
  PropsWithChildren<{
    /** Scale applied while pressed; 1 disables the shrink. */
    pressScale?: number;
    style?: React.ComponentProps<typeof Animated.View>['style'];
  }>;

const SPRING = { damping: 18, stiffness: 320 };

/** Pressable that shrinks and dims slightly on press — the base for every tappable surface. */
export function Pressable({
  pressScale = 0.97,
  style,
  children,
  disabled,
  ...rest
}: PressableProps) {
  const pressed = useSharedValue(0);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - pressScale) }],
    opacity: 1 - pressed.value * 0.08,
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        pressed.value = withSpring(1, SPRING);
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 180 });
      }}
      style={[animated, style]}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
}
