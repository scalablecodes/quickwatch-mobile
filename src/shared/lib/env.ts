/** Public runtime configuration, read from `EXPO_PUBLIC_*` at build time. */
export const env = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? 'https://quickwatch.onrender.com').replace(/\/$/, ''),
  stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
} as const;
