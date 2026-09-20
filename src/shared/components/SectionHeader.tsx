import { Pressable } from 'react-native';

import { Box, Text } from '@/shared/components/ui';

export type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Title row with an optional trailing link ("See all"). */
export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="space-between">
      <Text variant="h3">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onAction}>
          <Text variant="link">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </Box>
  );
}
