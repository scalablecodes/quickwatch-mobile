import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

import { Box } from './Box';
import type { IoniconName } from './Button';
import { Text } from './Text';

export type EmptyStateProps = {
  icon: IoniconName;
  title: string;
  message?: string;
  /** Usually a `Button`. */
  action?: ReactNode;
};

/** Centred illustration well + copy for empty lists and error states. */
export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInUp.duration(400)}>
      <Box alignItems="center" paddingVertical="xxl" paddingHorizontal="l" gap="m">
        <Box
          width={88}
          height={88}
          borderRadius="full"
          backgroundColor="primarySoft"
          alignItems="center"
          justifyContent="center">
          <Ionicons name={icon} size={38} color={colors.primary} />
        </Box>
        <Box gap="xs" alignItems="center">
          <Text variant="h3" textAlign="center">
            {title}
          </Text>
          {message ? (
            <Text variant="p14" color="textSecondary" textAlign="center">
              {message}
            </Text>
          ) : null}
        </Box>
        {action ? <Box marginTop="s">{action}</Box> : null}
      </Box>
    </Animated.View>
  );
}
