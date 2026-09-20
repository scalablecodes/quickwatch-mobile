import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/shared/components/brand/Logo';
import { Box, Button, Image, Pressable, Text } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

const hero = require('@/assets/images/mother_and_child.jpg');

const highlights: { icon: 'shield-checkmark' | 'flash' | 'chatbubbles'; text: string }[] = [
  { icon: 'shield-checkmark', text: 'Every sitter is reviewed and ID-verified' },
  { icon: 'flash', text: 'Book trusted care in minutes' },
  { icon: 'chatbubbles', text: 'Chat, pay and review in one place' },
];

/** Landing: full-bleed photo, brand, role CTAs. */
export function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Box flex={1} backgroundColor="primaryDark">
      <Image source={hero} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(21,20,51,0.15)', 'rgba(21,20,51,0.55)', colors.primaryDark]}
        locations={[0, 0.5, 0.82]}
        style={StyleSheet.absoluteFill}
      />
      <Box
        flex={1}
        justifyContent="space-between"
        style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.brand}>
          <Logo size={40} tone="onPrimary" />
          <Text variant="h3" color="onPrimary">
            QuickWatch
          </Text>
        </Animated.View>

        <Box paddingHorizontal="ml" gap="l">
          <Animated.View entering={FadeInUp.delay(120).duration(500)}>
            <Text variant="display" color="onPrimary">
              Care you can{'\n'}count on.
            </Text>
            <Text variant="p16" color="onPrimaryMuted" marginTop="s">
              Find a verified babysitter nearby, or earn by caring for families in your area.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(220).duration(500)}>
            <Box gap="s">
              {highlights.map((item) => (
                <Box key={item.text} flexDirection="row" alignItems="center" gap="sm">
                  <Box
                    width={28}
                    height={28}
                    borderRadius="full"
                    backgroundColor="overlaySoft"
                    alignItems="center"
                    justifyContent="center">
                    <Ionicons name={item.icon} size={15} color={colors.onPrimary} />
                  </Box>
                  <Text variant="p14Medium" color="onPrimary">
                    {item.text}
                  </Text>
                </Box>
              ))}
            </Box>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(320).duration(500)}>
            <Box gap="sm">
              <Button
                variant="accent"
                icon="people"
                onPress={() => router.push({ pathname: '/register', params: { role: 'Mother' } })}>
                I need a babysitter
              </Button>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  router.push({ pathname: '/register', params: { role: 'Babysitter' } })
                }>
                <Box
                  height={56}
                  borderRadius="full"
                  backgroundColor="overlaySoft"
                  borderWidth={1}
                  borderColor="overlayBorder"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  gap="s">
                  <Ionicons name="heart" size={20} color={colors.onPrimary} />
                  <Text variant="p16SemiBold" color="onPrimary">
                    I&apos;m a babysitter
                  </Text>
                </Box>
              </Pressable>
              <Pressable
                accessibilityRole="link"
                onPress={() => router.push('/login')}
                style={styles.login}>
                <Text variant="p14" color="onPrimaryMuted">
                  Already have an account?{' '}
                  <Text variant="p14SemiBold" color="onPrimary">
                    Log in
                  </Text>
                </Text>
              </Pressable>
            </Box>
          </Animated.View>
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 },
  login: { alignSelf: 'center', paddingVertical: 8 },
});
