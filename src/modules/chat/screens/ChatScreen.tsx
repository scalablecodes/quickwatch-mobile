import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/modules/auth/session';
import { participant } from '@/modules/bookings/lib/status';
import { useBooking } from '@/modules/bookings/queries';
import { chatApi } from '@/modules/chat/api';
import { getSocket } from '@/modules/chat/socket';
import type { ChatMessage, LiveMessage } from '@/modules/chat/types';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import { Avatar, Box, IconButton, Pressable, Text } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { formatDay, fullName } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

const chatKey = (bookingId: string) => ['chat', bookingId] as const;

function senderId(m: ChatMessage): string {
  return typeof m.sender === 'string' ? m.sender : m.sender._id;
}

function timeOf(value: string) {
  const d = new Date(value);
  const h = d.getHours();
  return `${h % 12 || 12}:${`${d.getMinutes()}`.padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

/** Booking conversation: history from the API, live updates over the socket, optimistic sends. */
export function ChatScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { colors, textVariants } = useTheme();
  const queryClient = useQueryClient();
  const { user, isMother } = useSession();
  const { booking } = useBooking(bookingId);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [draft, setDraft] = useState('');

  const other = participant(isMother ? booking?.babysitter : booking?.mother);
  const otherName = fullName(other);
  const receiverId = other?._id;

  const messages = useQuery({
    queryKey: chatKey(bookingId),
    queryFn: async () => (await chatApi.messages(bookingId)).messages,
    refetchInterval: 20_000,
  });

  // Live delivery: the API emits `chat:message` to the receiver's sockets.
  useEffect(() => {
    let active = true;
    let off: (() => void) | undefined;
    (async () => {
      const socket = await getSocket();
      if (!socket || !active) return;
      const onMessage = (live: LiveMessage) => {
        if (live.bookingId !== bookingId) return;
        queryClient.setQueryData<ChatMessage[]>(chatKey(bookingId), (current = []) => {
          if (current.some((m) => m._id === live._id)) return current;
          return [
            ...current,
            {
              _id: live._id,
              chat: live.chat,
              booking: live.bookingId,
              sender: live.senderId,
              receiver: live.receiverId,
              createdAt: live.createdAt,
            },
          ];
        });
      };
      socket.on('chat:message', onMessage);
      off = () => socket.off('chat:message', onMessage);
    })();
    return () => {
      active = false;
      off?.();
    };
  }, [bookingId, queryClient]);

  const send = useMutation({
    mutationFn: (text: string) => chatApi.send(bookingId, receiverId as string, text),
    onMutate: (text) => {
      const optimistic: ChatMessage = {
        _id: `local-${Date.now()}`,
        chat: text,
        booking: bookingId,
        sender: user?._id ?? '',
        receiver: receiverId ?? '',
        createdAt: new Date().toISOString(),
        pending: true,
      };
      queryClient.setQueryData<ChatMessage[]>(chatKey(bookingId), (current = []) => [
        ...current,
        optimistic,
      ]);
      return { id: optimistic._id };
    },
    onSuccess: ({ data }, _text, ctx) => {
      queryClient.setQueryData<ChatMessage[]>(chatKey(bookingId), (current = []) =>
        current.map((m) => (m._id === ctx?.id ? { ...data, sender: user?._id ?? data.sender } : m))
      );
    },
    onError: (e, _text, ctx) => {
      queryClient.setQueryData<ChatMessage[]>(chatKey(bookingId), (current = []) =>
        current.filter((m) => m._id !== ctx?.id)
      );
      toast.error('Message not sent', errorMessage(e));
    },
  });

  const submit = () => {
    const text = draft.trim();
    if (!text || !receiverId) return;
    setDraft('');
    send.mutate(text);
  };

  const data = messages.data ?? [];
  useEffect(() => {
    if (data.length) setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, [data.length]);

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader
        title={otherName || 'Chat'}
        right={
          <IconButton
            icon="calendar-outline"
            accessibilityLabel="View booking"
            backgroundColor="cardBackground"
            onPress={() => router.push({ pathname: '/booking/[id]', params: { id: bookingId } })}
          />
        }
      />
      {booking ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/booking/[id]', params: { id: bookingId } })}>
          <Box
            marginHorizontal="ml"
            marginBottom="s"
            flexDirection="row"
            alignItems="center"
            gap="s"
            backgroundColor="primarySoft"
            borderRadius="m"
            paddingHorizontal="sm"
            paddingVertical="s">
            <Ionicons name="calendar" size={15} color={colors.primary} />
            <Text variant="p12Medium" color="primary" style={{ flex: 1 }} numberOfLines={1}>
              {formatDay(booking.selectedStartDate)} · {booking.startTime} – {booking.endTime} ·{' '}
              {booking.location}
            </Text>
          </Box>
        </Pressable>
      ) : null}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(m) => m._id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            gap: 6,
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item, index }) => {
            const mine = senderId(item) === user?._id;
            const prev = data[index - 1];
            const grouped = prev ? senderId(prev) === senderId(item) : false;
            return (
              <Animated.View
                entering={mine ? FadeInUp.duration(200) : FadeInDown.duration(200)}
                style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
                {!mine && !grouped ? (
                  <Avatar uri={other?.picture} name={otherName} size={28} />
                ) : !mine ? (
                  <Box width={28} />
                ) : null}
                <Box
                  maxWidth="78%"
                  backgroundColor={mine ? 'primary' : 'cardBackground'}
                  paddingHorizontal="sm"
                  paddingVertical="s"
                  borderRadius="l"
                  style={[
                    mine ? styles.bubbleMine : styles.bubbleTheirs,
                    item.pending && styles.pending,
                  ]}>
                  <Text variant="p14" color={mine ? 'onPrimary' : 'text'}>
                    {item.chat}
                  </Text>
                  <Text
                    variant="micro"
                    color={mine ? 'onPrimaryMuted' : 'textHint'}
                    style={styles.time}>
                    {item.pending ? 'Sending…' : timeOf(item.createdAt)}
                  </Text>
                </Box>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            !messages.isLoading ? (
              <Box alignItems="center" gap="s" paddingVertical="xl">
                <Ionicons name="chatbubbles-outline" size={36} color={colors.textHint} />
                <Text variant="p14" color="textMuted" textAlign="center">
                  Say hello to {otherName || 'them'} — ask about routines, arrival time, anything.
                </Text>
              </Box>
            ) : null
          }
        />
        <Box
          flexDirection="row"
          alignItems="flex-end"
          gap="s"
          paddingHorizontal="m"
          paddingTop="s"
          backgroundColor="screenBackground"
          style={{ paddingBottom: insets.bottom + 8 }}>
          <Box
            flex={1}
            backgroundColor="cardBackground"
            borderRadius="xl"
            borderWidth={1.5}
            borderColor="border"
            paddingHorizontal="m"
            justifyContent="center"
            minHeight={48}>
            <TextInput
              accessibilityLabel="Message"
              placeholder="Write a message…"
              placeholderTextColor={colors.textHint}
              value={draft}
              onChangeText={setDraft}
              multiline
              maxLength={2000}
              selectionColor={colors.primary}
              style={[
                styles.input,
                { color: colors.text, fontFamily: textVariants.p16.fontFamily },
              ]}
            />
          </Box>
          <IconButton
            icon="send"
            accessibilityLabel="Send"
            backgroundColor={draft.trim() ? 'primary' : 'cardBackgroundSubtle'}
            color={draft.trim() ? 'onPrimary' : 'textHint'}
            size={48}
            iconSize={20}
            disabled={!draft.trim() || !receiverId}
            onPress={submit}
          />
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubbleMine: { borderBottomRightRadius: 6 },
  bubbleTheirs: { borderBottomLeftRadius: 6 },
  pending: { opacity: 0.7 },
  time: { alignSelf: 'flex-end', marginTop: 2 },
  input: { fontSize: 16, maxHeight: 120, paddingVertical: Platform.OS === 'ios' ? 12 : 8 },
});
