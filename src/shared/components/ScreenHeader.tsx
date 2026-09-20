import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { Box, IconButton, SafeAreaBox, Text } from '@/shared/components/ui';
import type { ThemeColor } from '@/shared/theme';

export type ScreenHeaderProps = {
  title?: string;
  /** Slot on the right (an `IconButton` or two). */
  right?: ReactNode;
  /** Hide the back button (root tab screens). */
  hideBack?: boolean;
  onBack?: () => void;
  backgroundColor?: ThemeColor;
  /** Large title layout below the bar. */
  large?: boolean;
  subtitle?: string;
};

const BAR_HEIGHT = 56;

/** Back button, centred (or large) title, optional right actions. */
export function ScreenHeader({
  title,
  right,
  hideBack = false,
  onBack,
  backgroundColor = 'screenBackground',
  large = false,
  subtitle,
}: ScreenHeaderProps) {
  const router = useRouter();
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  return (
    <SafeAreaBox edges={['top']} backgroundColor={backgroundColor}>
      <Box
        height={BAR_HEIGHT}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        gap="sm">
        {hideBack ? (
          <Box width={44} />
        ) : (
          <IconButton
            icon="chevron-back"
            accessibilityLabel="Back"
            backgroundColor="cardBackground"
            onPress={goBack}
          />
        )}
        {!large && title ? (
          <Text variant="h4" textAlign="center" style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <Box flex={1} />
        )}
        <Box minWidth={44} flexDirection="row" justifyContent="flex-end" gap="s">
          {right}
        </Box>
      </Box>
      {large && title ? (
        <Box paddingHorizontal="ml" paddingBottom="m" gap="xxs">
          <Text variant="h1">{title}</Text>
          {subtitle ? (
            <Text variant="p14" color="textSecondary">
              {subtitle}
            </Text>
          ) : null}
        </Box>
      ) : null}
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  title: { flex: 1 },
});
