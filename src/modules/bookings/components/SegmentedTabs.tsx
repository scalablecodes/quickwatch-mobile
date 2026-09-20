import { useState } from 'react';
import { Pressable, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Box, Text } from '@/shared/components/ui';

export type SegmentedTabsProps<T extends string> = {
  options: { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

const SPRING = { damping: 18, stiffness: 240 };

/** Segmented control with a sliding thumb. */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: SegmentedTabsProps<T>) {
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((o) => o.key === value)
  );
  const position = useSharedValue(index);
  position.value = withSpring(index, SPRING);
  const segment = width / options.length;

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * segment }],
    width: segment,
  }));

  return (
    <Box
      flexDirection="row"
      backgroundColor="cardBackgroundSubtle"
      borderRadius="full"
      padding="xs"
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width - 8)}>
      {width > 0 ? (
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <Box
            flex={1}
            borderRadius="full"
            backgroundColor="cardBackground"
            style={styles.thumbShadow}
          />
        </Animated.View>
      ) : null}
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.key)}
            style={styles.segment}>
            <Text variant="p14SemiBold" color={selected ? 'text' : 'textMuted'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  );
}

const styles = StyleSheet.create({
  segment: { flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' },
  thumb: { position: 'absolute', top: 4, bottom: 4, left: 4 },
  thumbShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
});
