/* eslint-disable react-hooks/immutability -- Reanimated shared values are mutable by
   design (that is how animations are driven); the React Compiler lint models them as
   immutable React values and flags every assignment. */
import { useCallback, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

export type BottomSheetProps = {
  visible: boolean;
  /** Called once the exit animation has finished. */
  onClose: () => void;
  children: ReactNode;
  /** Hide the drag affordance (e.g. when the content supplies its own header). */
  grabber?: boolean;
};

const ENTER_MS = 220;
const EXIT_MS = 180;

/**
 * Bottom sheet surface: scrim, rounded top corners, grabber, safe-area padding.
 *
 * The slide is driven by a shared value rather than reanimated's `SlideInDown`
 * layout animation: that left a residual transform, so the surface settled a few points
 * above the screen edge and exposed a strip of scrim beneath it.
 */
export function BottomSheet({ visible, onClose, children, grabber = true }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  // `1` parks the surface one full height below the fold, `0` seats it against the edge.
  const progress = useSharedValue(1);
  const opacity = useSharedValue(0);
  const [height, setHeight] = useState(0);

  const dismiss = useCallback(() => {
    progress.value = withTiming(
      1,
      { duration: EXIT_MS, easing: Easing.in(Easing.cubic) },
      (finished) => {
        'worklet';
        if (finished) scheduleOnRN(onClose);
      }
    );
    // `progress` is a stable shared-value ref, so it is not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const surfaceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * height }],
    // Hidden for the first frame, before the height is known and the slide can start.
    opacity: opacity.value,
  }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible onRequestClose={dismiss}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }, scrimStyle]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={StyleSheet.absoluteFill}
          onPress={dismiss}
        />
      </Animated.View>
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[styles.surface, surfaceStyle]}
          onLayout={(e) => {
            // Fires on every mount of the sheet, so each open replays the slide.
            setHeight(e.nativeEvent.layout.height);
            opacity.value = 1;
            progress.value = withTiming(0, {
              duration: ENTER_MS,
              easing: Easing.out(Easing.cubic),
            });
          }}>
          <Box
            backgroundColor="cardBackground"
            borderTopLeftRadius="sheet"
            borderTopRightRadius="sheet"
            paddingTop="sm"
            style={{ paddingBottom: insets.bottom + 8 }}>
            {grabber ? (
              <Box
                alignSelf="center"
                width={40}
                height={4}
                borderRadius="full"
                backgroundColor="borderStrong"
                marginBottom="sm"
              />
            ) : null}
            {children}
          </Box>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, justifyContent: 'flex-end' },
  surface: { width: '100%' },
});
