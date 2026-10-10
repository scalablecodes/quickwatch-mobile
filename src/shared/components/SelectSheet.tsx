import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Text } from '@/shared/components/ui';
import { useTheme } from '@/shared/theme';

export type SelectOption = { label: string; value: string };

export type SelectSheetProps = {
  visible: boolean;
  title: string;
  options: SelectOption[];
  value?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  /** Show the filter field; useful for long lists such as states. */
  searchable?: boolean;
};

/** Bottom-sheet single-select list with an optional filter. */
export function SelectSheet({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
  searchable = false,
}: SelectSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors, textVariants } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        entering={SlideInDown.springify().damping(20)}
        exiting={SlideOutDown.duration(200)}
        style={styles.sheet}>
        <Box
          backgroundColor="cardBackground"
          borderTopLeftRadius="sheet"
          borderTopRightRadius="sheet"
          paddingTop="m"
          style={{ paddingBottom: insets.bottom + 8, maxHeight: '75%' }}>
          <Box
            alignSelf="center"
            width={40}
            height={4}
            borderRadius="full"
            backgroundColor="borderStrong"
            marginBottom="m"
          />
          <Box paddingHorizontal="ml" gap="sm">
            <Text variant="h3">{title}</Text>
            {searchable ? (
              <Box
                flexDirection="row"
                alignItems="center"
                gap="s"
                height={46}
                paddingHorizontal="m"
                borderRadius="field"
                backgroundColor="inputBackground">
                <Ionicons name="search-outline" size={18} color={colors.textHint} />
                <TextInput
                  accessibilityLabel={`Search ${title}`}
                  placeholder="Search"
                  placeholderTextColor={colors.textHint}
                  value={query}
                  onChangeText={setQuery}
                  selectionColor={colors.primary}
                  style={[
                    styles.search,
                    { color: colors.text, fontFamily: textVariants.p16.fontFamily },
                  ]}
                />
              </Box>
            ) : null}
          </Box>
          <FlatList
            data={filtered}
            keyExtractor={(o) => o.value}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8 }}
            renderItem={({ item }) => {
              const selected = item.value === value;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}>
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical="sm">
                    <Text variant="p16" color={selected ? 'primary' : 'text'}>
                      {item.label}
                    </Text>
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    ) : null}
                  </Box>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text variant="p14" color="textMuted" paddingVertical="m">
                No matches.
              </Text>
            }
          />
        </Box>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  search: { flex: 1, fontSize: 16, paddingVertical: 0 },
});
