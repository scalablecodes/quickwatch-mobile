import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useCallback, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, Text } from '@/shared/components/ui';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { useTheme } from '@/shared/theme';

type Mode = 'date' | 'time';

type Request = {
  mode: Mode;
  value: Date;
  minimumDate?: Date;
  onChange: (date: Date) => void;
  title: string;
};

/**
 * Cross-platform date/time picking. Android uses the native dialog; iOS shows an inline
 * picker in a bottom sheet with a Done button. Render `<sheet.element />` once per screen.
 */
export function useDateTimeSheet() {
  const [request, setRequest] = useState<Request | null>(null);
  const [draft, setDraft] = useState<Date>(new Date());

  const open = useCallback((next: Request) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: next.mode,
        value: next.value,
        minimumDate: next.minimumDate,
        onChange: (event: DateTimePickerEvent, date?: Date) => {
          if (event.type === 'set' && date) next.onChange(date);
        },
      });
      return;
    }
    setDraft(next.value);
    setRequest(next);
  }, []);

  const element = (
    <Sheet request={request} draft={draft} setDraft={setDraft} close={() => setRequest(null)} />
  );
  return { open, element };
}

function Sheet({
  request,
  draft,
  setDraft,
  close,
}: {
  request: Request | null;
  draft: Date;
  setDraft: (d: Date) => void;
  close: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const scheme = useColorScheme();
  if (!request) return null;

  return (
    <Modal transparent animationType="none" visible onRequestClose={close}>
      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={StyleSheet.absoluteFill}
          onPress={close}
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
          padding="ml"
          gap="s"
          style={{ paddingBottom: insets.bottom + 16 }}>
          <Box
            alignSelf="center"
            width={40}
            height={4}
            borderRadius="full"
            backgroundColor="borderStrong"
            marginBottom="s"
          />
          <Text variant="h3">{request.title}</Text>
          <DateTimePicker
            mode={request.mode}
            display={request.mode === 'date' ? 'inline' : 'spinner'}
            value={draft}
            minimumDate={request.minimumDate}
            themeVariant={scheme === 'dark' ? 'dark' : 'light'}
            accentColor={colors.primary}
            onChange={(_e, date) => date && setDraft(date)}
            style={styles.picker}
          />
          <Button
            onPress={() => {
              request.onChange(draft);
              close();
            }}>
            Done
          </Button>
        </Box>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  picker: { alignSelf: 'center' },
});
