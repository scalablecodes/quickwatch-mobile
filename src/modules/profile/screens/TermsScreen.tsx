import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { termsIntro, termsSections } from '@/modules/profile/data/terms';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { Box, Card, ScrollBox, Text } from '@/shared/components/ui';

export function TermsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title="Terms of Service" />
      <ScrollBox
        flex={1}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 4,
          gap: 12,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}>
        <Text variant="p14" color="textSecondary">
          {termsIntro}
        </Text>
        {termsSections.map((section, i) => (
          <Animated.View
            key={section.title}
            entering={FadeInUp.delay(Math.min(i, 6) * 50).duration(350)}>
            <Card gap="s">
              <Box flexDirection="row" alignItems="center" gap="s">
                <Box
                  width={26}
                  height={26}
                  borderRadius="full"
                  backgroundColor="primarySoft"
                  alignItems="center"
                  justifyContent="center">
                  <Text variant="p12Bold" color="primary">
                    {i + 1}
                  </Text>
                </Box>
                <Text variant="h4">{section.title}</Text>
              </Box>
              {section.items.map((item) => (
                <Box key={item} flexDirection="row" gap="s">
                  <Text variant="p14" color="primary">
                    •
                  </Text>
                  <Text variant="p14" color="textSecondary" style={{ flex: 1 }}>
                    {item}
                  </Text>
                </Box>
              ))}
            </Card>
          </Animated.View>
        ))}
      </ScrollBox>
    </Box>
  );
}
