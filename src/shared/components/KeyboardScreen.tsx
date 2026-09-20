import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, ScrollBox } from '@/shared/components/ui';
import type { ThemeColor } from '@/shared/theme';

export type KeyboardScreenProps = PropsWithChildren<{
  /** Pinned below the scroll area (usually the submit button). */
  footer?: React.ReactNode;
  backgroundColor?: ThemeColor;
  contentStyle?: ViewStyle;
}>;

/** Scrollable form body that stays clear of the keyboard, with an optional pinned footer. */
export function KeyboardScreen({
  children,
  footer,
  backgroundColor = 'screenBackground',
  contentStyle,
}: KeyboardScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
      <Box flex={1} backgroundColor={backgroundColor}>
        <ScrollBox
          flex={1}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: footer ? 16 : insets.bottom + 24 },
            contentStyle,
          ]}>
          {children}
        </ScrollBox>
        {footer ? (
          <Box paddingHorizontal="ml" paddingTop="s" style={{ paddingBottom: insets.bottom + 12 }}>
            {footer}
          </Box>
        ) : null}
      </Box>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 20 },
});
