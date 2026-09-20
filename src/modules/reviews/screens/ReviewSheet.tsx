import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { reviewsApi } from '@/modules/reviews/api';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, Stars, Text, TextField } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';

const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

/** Bottom sheet: rate the other party of a completed booking. */
export function ReviewSheet() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { bookingId, name } = useLocalSearchParams<{ bookingId: string; name?: string }>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submit = useMutation({
    mutationFn: () => reviewsApi.create(bookingId, rating, comment.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Thanks for your review');
      router.back();
    },
    onError: (e) => toast.error('Could not submit review', errorMessage(e)),
  });

  return (
    <Box
      backgroundColor="cardBackground"
      padding="ml"
      gap="m"
      style={{ paddingBottom: insets.bottom + 20 }}>
      <Box gap="xs">
        <Text variant="h2">How was {name ?? 'it'}?</Text>
        <Text variant="p14" color="textSecondary">
          Your review helps other families and sitters.
        </Text>
      </Box>
      <Box alignItems="center" gap="s" paddingVertical="s">
        <Stars value={rating} size={40} onChange={setRating} />
        <Text variant="p14SemiBold" color={rating ? 'primary' : 'textHint'}>
          {rating ? labels[rating] : 'Tap a star'}
        </Text>
      </Box>
      <TextField
        placeholder="Share a few words (optional)"
        value={comment}
        onChangeText={setComment}
        textArea
        maxLength={2000}
      />
      <Button onPress={() => submit.mutate()} disabled={rating === 0} loading={submit.isPending}>
        Submit review
      </Button>
    </Box>
  );
}
