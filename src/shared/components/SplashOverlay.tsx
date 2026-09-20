import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Logo } from '@/shared/components/brand/Logo';
import { Text } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

const INTRO_DURATION = 600;
const HOLD_DURATION = 700;
const OUTRO_DURATION = 420;

// The violet canvas grows from the centre, then the mark springs in and the whole thing fades out.
const canvasIn = new Keyframe({
  0: { transform: [{ scale: 0 }], borderRadius: 400 },
  100: { transform: [{ scale: 1 }], borderRadius: 0, easing: Easing.out(Easing.cubic) },
});
const logoIn = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.5 }, { rotate: '-8deg' }] },
  100: { opacity: 1, transform: [{ scale: 1 }, { rotate: '0deg' }], easing: Easing.elastic(0.9) },
});

type Phase = 'native' | 'canvas' | 'intro' | 'outro' | 'done';

/**
 * Branded splash. Sits over the app while it boots, matching the native splash so the
 * hand-off is seamless, then fades out to the first screen.
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
        SplashScreen.hideAsync().finally(() => setPhase('canvas'));
      }}
      style={[styles.overlay, { backgroundColor: colors.mainBackground }]}
      pointerEvents={phase === 'outro' ? 'none' : 'auto'}>
      {phase !== 'native' && (
        <Animated.View
          entering={canvasIn.duration(520).withCallback((finished) => {
            'worklet';
            if (finished) scheduleOnRN(setPhase, 'intro');
          })}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.primary }]}
        />
      )}
      {showContent && (
        <View style={styles.center}>
          <Animated.View entering={logoIn.duration(INTRO_DURATION)}>
            <Logo size={84} tone="onPrimary" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(INTRO_DURATION * 0.5).duration(400)}>
            <Text variant="h2" color="onPrimary" textAlign="center">
              QuickWatch
            </Text>
            <Text variant="p14" color="onPrimaryMuted" textAlign="center">
              Trusted care, right when you need it.
            </Text>
          </Animated.View>
        </View>
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

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  center: { alignItems: 'center', gap: 16 },
});
