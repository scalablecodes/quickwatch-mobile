import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { Href } from 'expo-router';
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

import { Box, Text, type IoniconName } from './ui';

// Floating pill, 8pt above the home indicator. Active tab expands to show its label on a violet well.
const PILL_PADDING = 8;
const ITEM_HEIGHT = 48;
const PILL_HEIGHT = ITEM_HEIGHT + PILL_PADDING * 2;
const PILL_BOTTOM_GAP = 10;
const SPRING = { damping: 16, stiffness: 260 };

/** Space scrollable content should leave at the bottom so the floating bar never covers it. */
export function useTabBarInset() {
  const insets = useSafeAreaInsets();
  return insets.bottom + PILL_BOTTOM_GAP + PILL_HEIGHT + 12;
}

export type TabSpec = {
  name: string;
  href: Href;
  icon: IoniconName;
  activeIcon: IoniconName;
  label: string;
};

const tabs: TabSpec[] = [
  { name: 'home', href: '/home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
  {
    name: 'bookings',
    href: '/bookings',
    icon: 'calendar-outline',
    activeIcon: 'calendar',
    label: 'Bookings',
  },
  {
    name: 'messages',
    href: '/messages',
    icon: 'chatbubble-ellipses-outline',
    activeIcon: 'chatbubble-ellipses',
    label: 'Messages',
  },
  {
    name: 'profile',
    href: '/profile',
    icon: 'person-outline',
    activeIcon: 'person',
    label: 'Profile',
  },
];

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <FloatingBar>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton tab={tab} />
            </TabTrigger>
          ))}
        </FloatingBar>
      </TabList>
    </Tabs>
  );
}

function FloatingBar({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      bottom={0}
      alignItems="center"
      pointerEvents="box-none"
      style={{ paddingBottom: insets.bottom + PILL_BOTTOM_GAP }}>
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="cardBackground"
        borderRadius="full"
        borderWidth={1}
        borderColor="border"
        style={[styles.pill, { shadowColor: colors.black }]}>
        {children}
      </Box>
    </Box>
  );
}

type TabButtonProps = TabTriggerSlotProps & { tab: TabSpec };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabButton({ isFocused = false, tab, onPress, ...props }: TabButtonProps) {
  const { colors } = useTheme();
  const pressed = useSharedValue(0);
  const active = useDerivedValue(() => withSpring(isFocused ? 1 : 0, SPRING), [isFocused]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.08 }],
  }));
  const wellStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(active.value, [0, 1], [colors.transparent, colors.primary]),
    paddingHorizontal: interpolate(active.value, [0, 1], [12, 16]),
  }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity: active.value,
    maxWidth: interpolate(active.value, [0, 1], [0, 90]),
    marginLeft: interpolate(active.value, [0, 1], [0, 6]),
  }));

  return (
    <AnimatedPressable
      {...props}
      onPress={(e) => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isFocused }}
      hitSlop={6}
      onPressIn={() => {
        pressed.value = withSpring(1, SPRING);
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 160 });
      }}
      style={pressStyle}>
      <Animated.View style={[styles.well, wellStyle]}>
        <Ionicons
          name={isFocused ? tab.activeIcon : tab.icon}
          size={22}
          color={isFocused ? colors.onPrimary : colors.textMuted}
        />
        <Animated.View style={[styles.label, labelStyle]}>
          <Text variant="p14SemiBold" color="onPrimary" numberOfLines={1}>
            {tab.label}
          </Text>
        </Animated.View>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    padding: PILL_PADDING,
    gap: 4,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 12,
  },
  well: {
    height: ITEM_HEIGHT,
    borderRadius: ITEM_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { overflow: 'hidden' },
});
