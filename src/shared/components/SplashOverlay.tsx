import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Logo } from '@/shared/components/brand/Logo';
import { Text } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

const MARK_SIZE = 96;
const INTRO_DURATION = 600;
const HOLD_DURATION = 900;
const OUTRO_DURATION = 420;

// The mark springs in from small with a slight tilt, over a gold ring that pulses outward.
const logoIn = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.5 }, { rotate: '-8deg' }] },
  100: { opacity: 1, transform: [{ scale: 1 }, { rotate: '0deg' }], easing: Easing.elastic(0.9) },
});

type Phase = 'native' | 'intro' | 'outro' | 'done';

/**
 * Branded splash on the primary violet, matching the native splash so the hand-off is
 * seamless. Shows the mark with a gold pulse and loading bar, then fades to the first screen.
 */
export function SplashOverlay({ ready }: { ready: boolean }) {
  const { colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('native');

  useEffect(() => {
    if (phase !== 'intro' || !ready) return;
    const timer = setTimeout(() => setPhase('outro'), INTRO_DURATION + HOLD_DURATION);
    return () => clearTimeout(timer);
  }, [phase, ready]);

  if (phase === 'done') return null;
  const showContent = phase === 'intro' || phase === 'outro';

  return (
    <View
      onLayout={() => {
        if (phase !== 'native') return;
        SplashScreen.hideAsync().finally(() => setPhase('intro'));
      }}
      style={[styles.overlay, { backgroundColor: colors.primary }]}
      pointerEvents={phase === 'outro' ? 'none' : 'auto'}>
      {showContent && (
        <>
          <View style={styles.center}>
            <View style={styles.markWrap}>
              <GoldPulse />
              <Animated.View entering={logoIn.duration(INTRO_DURATION)}>
                <Logo size={MARK_SIZE} tone="onPrimary" />
              </Animated.View>
            </View>
            <Animated.View entering={FadeInDown.delay(INTRO_DURATION * 0.5).duration(400)}>
              <Text variant="h1" color="onPrimary" textAlign="center">
                QuickWatch
              </Text>
              <Text variant="p14" color="onPrimaryMuted" textAlign="center">
                Trusted care, right when you need it.
              </Text>
            </Animated.View>
          </View>
          <Animated.View
            entering={FadeIn.delay(INTRO_DURATION).duration(300)}
            style={styles.footer}>
            <LoadingBar />
          </Animated.View>
        </>
      )}
      {phase === 'outro' && (
        <Animated.View
          entering={FadeIn.duration(OUTRO_DURATION)
            .easing(Easing.out(Easing.cubic))
            .withCallback((finished) => {
              'worklet';
              if (finished) scheduleOnRN(setPhase, 'done');
            })}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.mainBackground }]}
        />
      )}
    </View>
  );
}

/** Gold ring that expands and fades behind the mark, twice. */
function GoldPulse() {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      INTRO_DURATION * 0.4,
      withRepeat(withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }), 2, false)
    );
  }, [progress]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - progress.value),
    transform: [{ scale: 1 + progress.value * 0.9 }],
  }));
  return <Animated.View style={[styles.pulse, { borderColor: colors.accent }, style]} />;
}

/** Thin gold bar that sweeps left-to-right while the app boots. */
function LoadingBar() {
  const { colors } = useTheme();
  const x = useSharedValue(-1);
  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(-1, { duration: 0 }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.cubic) })
      ),
      -1,
      false
    );
  }, [x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * BAR_WIDTH }] }));
  return (
    <View style={[styles.track, { backgroundColor: colors.overlayFaint }]}>
      <Animated.View style={[styles.thumb, { backgroundColor: colors.accent }, style]} />
    </View>
  );
}

const BAR_WIDTH = 120;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  center: { alignItems: 'center', gap: 18 },
  markWrap: { alignItems: 'center', justifyContent: 'center' },
  pulse: {
    position: 'absolute',
    width: MARK_SIZE + 24,
    height: MARK_SIZE + 24,
    borderRadius: (MARK_SIZE + 24) * 0.32,
    borderWidth: 3,
  },
  footer: { position: 'absolute', bottom: 72, left: 0, right: 0, alignItems: 'center' },
  track: { width: BAR_WIDTH, height: 4, borderRadius: 2, overflow: 'hidden' },
  thumb: { width: BAR_WIDTH * 0.5, height: 4, borderRadius: 2 },
});
