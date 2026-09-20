import Animated, { FadeInDown } from 'react-native-reanimated';

import { Box, Text } from '@/shared/components/ui';

export function AuthHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Animated.View entering={FadeInDown.duration(450)}>
      <Box gap="xs">
        <Text variant="h1">{title}</Text>
        {subtitle ? (
          <Text variant="p14" color="textSecondary">
            {subtitle}
          </Text>
        ) : null}
      </Box>
    </Animated.View>
  );
}
