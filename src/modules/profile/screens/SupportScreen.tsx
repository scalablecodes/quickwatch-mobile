import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/modules/auth/session';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { Box, Card, Divider, ListRow, ScrollBox, Text } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

const SUPPORT_EMAIL = 'support@quickwatch.app';

const faqs = [
  {
    q: 'How do payments work?',
    a: 'Parents pay through the app once a sitter accepts. Sitters request a payout after the job is marked complete, and QuickWatch transfers the earnings to their bank account.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes — open the booking and tap Cancel while it is requested or accepted. Paid bookings can be refunded from the same screen.',
  },
  {
    q: 'Why is my sitter account pending?',
    a: 'Every sitter profile is reviewed by our team before it goes live. This usually takes one to two days.',
  },
  {
    q: 'How do I reset my password?',
    a: 'Log out, tap “Forgot password?” on the login screen and follow the link we email you.',
  },
];

export function SupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useSession();

  const email = () =>
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('QuickWatch support')}&body=${encodeURIComponent(
        `\n\n—\nAccount: ${user?.Email ?? ''}`
      )}`
    );

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title="Help & support" />
      <ScrollBox
        flex={1}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 4,
          gap: 14,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card variant="primary" gap="s">
            <Ionicons name="help-buoy" size={30} color={colors.onPrimary} />
            <Text variant="h2" color="onPrimary">
              We&apos;re here to help
            </Text>
            <Text variant="p14" color="onPrimaryMuted">
              Questions about a booking, a payment or your account? Reach us any time and we&apos;ll
              get back within one business day.
            </Text>
          </Card>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(80).duration(400)}>
          <Card>
            <ListRow
              icon="mail-outline"
              title="Email support"
              subtitle={SUPPORT_EMAIL}
              onPress={email}
            />
            <Divider />
            <ListRow
              icon="document-text-outline"
              title="Terms & privacy"
              subtitle="How QuickWatch works"
              iconColor="info"
              iconBackground="infoSoft"
              onPress={() => router.push('/terms')}
            />
          </Card>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(160).duration(400)}>
          <Box gap="s">
            <Text variant="h3">Common questions</Text>
            {faqs.map((faq) => (
              <Card key={faq.q} gap="xs">
                <Text variant="p14SemiBold">{faq.q}</Text>
                <Text variant="p14" color="textSecondary">
                  {faq.a}
                </Text>
              </Card>
            ))}
          </Box>
        </Animated.View>
      </ScrollBox>
    </Box>
  );
}
