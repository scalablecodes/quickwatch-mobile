import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/shared/components/Toast';

/** Web stub: the Stripe PaymentSheet is only available in the mobile app. */
export function usePayBooking(_bookingId: string) {
  const toast = useToast();
  return useMutation({
    mutationFn: async () => null,
    onSuccess: () =>
      toast.info('Pay in the app', 'Booking payments are available in the QuickWatch mobile app.'),
  });
}
