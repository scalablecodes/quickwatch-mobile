import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useCallback, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { BottomSheet } from '@/shared/components/BottomSheet';
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
 * picker in a bottom sheet with a Done button. Render `{sheet.element}` once per screen.
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
  const { colors } = useTheme();
  const scheme = useColorScheme();

  return (
    <BottomSheet visible={request !== null} onClose={close}>
      {request ? (
        <Box paddingHorizontal="ml" gap="s">
          <Text variant="h3">{request.title}</Text>
          <DateTimePicker
            mode={request.mode}
            display={request.mode === 'date' ? 'inline' : 'spinner'}
            value={draft}
            minimumDate={request.minimumDate}
            themeVariant={scheme === 'dark' ? 'dark' : 'light'}
            accentColor={colors.primary}
            onChange={(_e, date) => date && setDraft(date)}
            // iOS collapses the picker to a sliver without an explicit height.
            style={[styles.picker, request.mode === 'date' ? styles.calendar : styles.spinner]}
          />
          <Button
            onPress={() => {
              request.onChange(draft);
              close();
            }}>
            Done
          </Button>
        </Box>
      ) : null}
    </BottomSheet>
  );
}

// Heights match UIDatePicker's intrinsic sizes: the inline calendar needs ~360,
// the wheel ~216. Without them iOS lays the picker out at near-zero height.
const styles = StyleSheet.create({
  picker: { alignSelf: 'stretch', width: '100%' },
  calendar: { height: 360 },
  spinner: { height: 216 },
});
