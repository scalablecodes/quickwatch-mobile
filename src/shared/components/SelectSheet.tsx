import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Divider, Text } from '@/shared/components/ui';
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
  /** Render the option's value on the right (e.g. the state abbreviation). */
  showValue?: boolean;
};

const ROW_HEIGHT = 52;
// A plain ease-out slide: a spring overshoots, which reads as noisy on a long list.
const ENTER_MS = 220;
const EXIT_MS = 180;

/** Bottom-sheet single-select list with an optional filter. */
export function SelectSheet({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
  searchable = false,
  showValue = false,
}: SelectSheetProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { colors, textVariants } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  if (!visible) return null;

  // Cap the list so it always ends on a whole row instead of slicing one in half.
  const chromeHeight = (searchable ? 110 : 64) + insets.bottom + 12;
  const maxRows = Math.max(3, Math.floor((height * 0.7 - chromeHeight) / ROW_HEIGHT));
  const listHeight = Math.min(filtered.length, maxRows) * ROW_HEIGHT;

  return (
    <Modal transparent animationType="none" visible onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(ENTER_MS)}
        exiting={FadeOut.duration(EXIT_MS)}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        entering={SlideInDown.duration(ENTER_MS).easing(Easing.out(Easing.cubic))}
        exiting={SlideOutDown.duration(EXIT_MS).easing(Easing.in(Easing.cubic))}
        style={styles.sheet}>
        <Box
          backgroundColor="cardBackground"
          borderTopLeftRadius="sheet"
          borderTopRightRadius="sheet"
          paddingTop="sm"
          style={{ paddingBottom: insets.bottom + 8 }}>
          <Box
            alignSelf="center"
            width={40}
            height={4}
            borderRadius="full"
            backgroundColor="borderStrong"
            marginBottom="sm"
          />
          <Box paddingHorizontal="ml" gap="sm" paddingBottom="s">
            <Text variant="h3">{title}</Text>
            {searchable ? (
              <Box
                flexDirection="row"
                alignItems="center"
                gap="s"
                height={44}
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
            style={{ height: listHeight }}
            getItemLayout={(_d, index) => ({
              length: ROW_HEIGHT,
              offset: ROW_HEIGHT * index,
              index,
            })}
            ItemSeparatorComponent={() => <Divider marginHorizontal="ml" />}
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
                    height={ROW_HEIGHT}
                    flexDirection="row"
                    alignItems="center"
                    gap="sm"
                    paddingHorizontal="ml">
                    <Text variant="p16" color={selected ? 'primary' : 'text'} style={styles.label}>
                      {item.label}
                    </Text>
                    {showValue ? (
                      <Text variant="p14" color="textMuted">
                        {item.value}
                      </Text>
                    ) : null}
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    ) : null}
                  </Box>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Box paddingHorizontal="ml" paddingVertical="m">
                <Text variant="p14" color="textMuted">
                  No matches.
                </Text>
              </Box>
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
  label: { flex: 1 },
});
