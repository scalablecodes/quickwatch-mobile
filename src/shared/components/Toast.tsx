import { Ionicons } from '@expo/vector-icons';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Text } from '@/shared/components/ui';
import { useTheme, type ThemeColor } from '@/shared/theme';

type Tone = 'success' | 'error' | 'info';
type ToastMessage = { id: number; tone: Tone; title: string; message?: string };

type ToastApi = {
  show: (tone: Tone, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const DURATION = 3200;

const tones: Record<
  Tone,
  { icon: 'checkmark-circle' | 'alert-circle' | 'information-circle'; color: ThemeColor }
> = {
  success: { icon: 'checkmark-circle', color: 'success' },
  error: { icon: 'alert-circle', color: 'danger' },
  info: { icon: 'information-circle', color: 'info' },
};

/** Top-anchored toast. One at a time; a new toast replaces the current one. */
export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((tone: Tone, title: string, message?: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), tone, title, message });
    timer.current = setTimeout(() => setToast(null), DURATION);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (t, m) => show('success', t, m),
      error: (t, m) => show('error', t, m),
      info: (t, m) => show('info', t, m),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? <ToastView toast={toast} onDismiss={() => setToast(null)} /> : null}
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const tone = tones[toast.tone];

  return (
    <Animated.View
      key={toast.id}
      entering={FadeInUp.springify().damping(18).stiffness(220)}
      exiting={FadeOutUp.duration(200)}
      style={[styles.wrap, { top: insets.top + 8 }]}
      pointerEvents="box-none">
      <Pressable accessibilityRole="alert" onPress={onDismiss}>
        <Box
          flexDirection="row"
          alignItems="center"
          gap="sm"
          backgroundColor="cardBackground"
          borderRadius="l"
          paddingVertical="sm"
          paddingHorizontal="m"
          style={[styles.card, { shadowColor: colors.black }]}>
          <Ionicons name={tone.icon} size={22} color={colors[tone.color]} />
          <Box flex={1} gap="xxs">
            <Text variant="p14SemiBold">{toast.title}</Text>
            {toast.message ? (
              <Text variant="p12" color="textSecondary">
                {toast.message}
              </Text>
            ) : null}
          </Box>
        </Box>
      </Pressable>
    </Animated.View>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used within ToastProvider');
  return api;
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, zIndex: 2000 },
  card: {
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },
});
