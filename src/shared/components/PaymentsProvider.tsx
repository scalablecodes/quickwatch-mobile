import { StripeProvider } from '@stripe/stripe-react-native';
import type { ReactElement } from 'react';

import { env } from '@/shared/lib/env';

/** Stripe SDK context for the PaymentSheet (native only; see `.web.tsx`). */
export function PaymentsProvider({ children }: { children: ReactElement }) {
  return (
    <StripeProvider
      publishableKey={env.stripePublishableKey}
      merchantIdentifier="merchant.com.macdaniel2026.quickwatch"
      urlScheme="quick-watch">
      {children}
    </StripeProvider>
  );
}
