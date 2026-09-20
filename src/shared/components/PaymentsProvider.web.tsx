import type { PropsWithChildren } from 'react';

/** The Stripe native SDK has no web build; payments are mobile-only. */
export function PaymentsProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
