# QuickWatch — engineering standards

Work to senior-engineer standards: small, intentional changes; understand the surrounding code before editing; verify before reporting done.

## Stack

- Expo SDK 57, Expo Router (file-based routes in `src/app`), React Native 0.86, React 19, TypeScript strict.
- Styling: `@shopify/restyle`. No ad-hoc `StyleSheet` colors/spacing — use theme tokens.
- Data: `@tanstack/react-query` for every API read/write; the fetch wrapper is `src/shared/lib/api.ts`.
- Native UI: prefer Expo components (`expo-image`, `expo-linear-gradient`, Native Tabs via `expo-router/ui`) over third-party equivalents.
- Animation: `react-native-reanimated` + `react-native-worklets`.
- Payments: `@stripe/stripe-react-native` PaymentSheet (needs a dev build, not Expo Go).
- Chat: REST history + `socket.io-client` for live delivery.

## Backend

- Base URL from `EXPO_PUBLIC_API_URL` (default `https://quickwatch.onrender.com`). Docs: `https://quickwatch.onrender.com/api-docs`. Source: `../quickwatch-backend`.
- Auth is a bearer JWT (1h expiry) stored in `expo-secure-store`; any 401 signs the user out.
- Accounts have `roles` (Mother/Babysitter) and an active `role`; babysitters start `pendingReview` and every write endpoint requires `status === 'Active'` + a verified email.
- Booking lifecycle: `requested → accepted → (paid) → inProgress → completed`, with `declined/cancelled/refunded` terminal. Payment is only possible while `accepted`.

## Project layout

- `src/app/` — routes only; screens delegate to feature modules.
- `src/modules/<feature>/` — feature code (`api.ts`, `types.ts`, `queries.ts`, `screens/`, `components/`, `lib/`).
- `src/shared/components/ui/` — restyle primitives (`Box`, `Text`, `Card`, `Button`, `TextField`, `Avatar`, `Chip`, `StatusPill`, `Skeleton`, `EmptyState`, `ListRow`, …). Add new primitives here.
- `src/shared/components/` — app-level shared components (`AppTabs`, `ScreenHeader`, `Toast`, `KeyboardScreen`, `DateTimeSheet`, …).
- `src/shared/theme/` — the single source of design tokens. `palette.ts` holds raw colours; `theme.ts` maps them to semantic tokens (`darkTheme`, `layout`, typed `useTheme`). Components never import `Palette` directly.
- Path alias: `@/*` → `src/*`, `@/assets/*` → `assets/*`.

## Coding standards

- TypeScript: no `any`, no non-null assertions without a comment, explicit prop types exported next to components.
- Components: function components, PascalCase filenames. Hooks/theme/lib files kebab-case.
- Typography: use `Text` variants (`h1`–`h5`, `p16`, `p14Medium`, `p12Bold`, `overline`, `micro`, …) — never set `fontSize`/`fontFamily`/`fontWeight` inline. Font is Plus Jakarta Sans via `useFonts`.
- Styling: theme keys as props (`<Box padding="m" backgroundColor="cardBackground">`). Computed/non-token values go in `style={}`. New colors/spacing/radii/text variants are added to `theme.ts`, never inlined.
- Dark mode is mandatory: every colour must come from the theme so `darkTheme` covers it.
- Icons: `Ionicons` from `@expo/vector-icons` via the `IoniconName` type.
- Animation: keep the springy feel. Use reanimated `entering`/`exiting` (`FadeInUp`, `FadeInDown`, `LinearTransition`) and `useAnimatedStyle` for interactions. Don't ship static mount/unmount for UI that appears or changes.
- Errors: surface API failures with `useToast()` + `errorMessage(error)`; never swallow silently.
- Accessibility: pressables get `accessibilityRole`/`accessibilityLabel`; respect safe areas.
- Imports: absolute `@/…` for cross-folder, relative within a folder. Sorted (external → `@/` → relative).
- No dead code, no commented-out blocks, no `console.log` left behind.
- Formatting: Prettier (`.prettierrc`) and `expo lint` are the source of truth.

## Before finishing any change

```bash
npm run typecheck && npm run lint
```

Both must pass. For anything touching routing or native modules, also confirm a Metro bundle succeeds (`npx expo export --platform ios`).

## Docs

Consult the exact SDK 57 docs (`https://docs.expo.dev/versions/v57.0.0/`) for any Expo API — behaviour has changed across SDKs; do not rely on memory.
