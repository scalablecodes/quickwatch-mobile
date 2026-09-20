# QuickWatch

Trusted babysitting, booked in minutes. Parents find verified sitters nearby and pay in-app; sitters accept requests, chat with families and get paid out.

Built with Expo SDK 57 · Expo Router · React Native 0.86 · TypeScript · `@shopify/restyle` · React Query · Stripe.

## Getting started

```bash
npm install
cp .env.example .env   # set EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
npx expo run:ios       # or: npx expo run:android
```

Stripe PaymentSheet and push notifications need a development build — they do not run in Expo Go. Everything else works with `npm start`.

## Scripts

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `npm start`         | Metro dev server                |
| `npm run ios`       | Build & run on the iOS simulator |
| `npm run android`   | Build & run on Android          |
| `npm run typecheck` | `tsc --noEmit`                  |
| `npm run lint`      | `expo lint`                     |

## Layout

```
src/
  app/          Expo Router routes (thin re-exports of module screens)
  modules/      auth · home · sitters · bookings · chat · payments · reviews · notifications · kyc · profile
  shared/
    components/ AppTabs, ScreenHeader, Toast, KeyboardScreen, DateTimeSheet, ui/ primitives
    theme/      palette → semantic tokens, typography, dark mode
    lib/        api client, secure storage, formatting helpers
```

See `CLAUDE.md` for engineering standards.

## Backend

`https://quickwatch.onrender.com` — Swagger at `/api-docs`. Source in `../quickwatch-backend`.
