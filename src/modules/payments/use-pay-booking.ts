import { useStripe } from '@stripe/stripe-react-native';
import { useMutation } from '@tanstack/react-query';

import { bookingsApi } from '@/modules/bookings/api';
import { useInvalidateBookings, useUpsertBooking } from '@/modules/bookings/queries';
import { useToast } from '@/shared/components/Toast';
import { errorMessage } from '@/shared/lib/api';

import { paymentsApi } from './api';

/**
 * Pay for an accepted booking: create the PaymentIntent, present Stripe's PaymentSheet,
 * then confirm with the API so the booking flips to paid.
 */
export function usePayBooking(bookingId: string) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const toast = useToast();
  const upsert = useUpsertBooking();
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: async () => {
      const intent = await bookingsApi.createPaymentIntent(bookingId);
      const init = await initPaymentSheet({
        merchantDisplayName: 'QuickWatch',
        paymentIntentClientSecret: intent.clientSecret,
        allowsDelayedPaymentMethods: false,
        returnURL: 'quick-watch://stripe-redirect',
        applePay: { merchantCountryCode: 'US' },
        googlePay: { merchantCountryCode: 'US', testEnv: __DEV__ },
        style: 'automatic',
      });
      if (init.error) throw new Error(init.error.message);
      const result = await presentPaymentSheet();
      if (result.error) {
        if (result.error.code === 'Canceled') return null;
        throw new Error(result.error.message);
      }
      return paymentsApi.confirm(bookingId, intent.paymentIntentId);
    },
    onSuccess: (data) => {
      if (!data) return;
      upsert(data.booking);
      invalidate();
      toast.success('Payment complete', 'Your booking is confirmed.');
    },
    onError: (e) => toast.error('Payment failed', errorMessage(e)),
  });
}
