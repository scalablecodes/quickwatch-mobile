import { useEffect } from 'react';
import { StyleSheet, type DimensionValue } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  /** Fully rounded (avatar placeholder). */
  circle?: boolean;
};

/** Pulsing placeholder block. Compose several to sketch the layout that's loading. */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  circle = false,
}: SkeletonProps) {
  const { colors } = useTheme();
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [pulse]);

  const style = useAnimatedStyle(() => ({ opacity: 0.55 + pulse.value * 0.45 }));

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: circle ? height / 2 : radius,
          backgroundColor: colors.skeleton,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: { overflow: 'hidden' },
});
