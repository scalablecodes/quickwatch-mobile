import { useTheme as useRestyleTheme } from '@shopify/restyle';

import type { Theme } from './theme';

export { Palette, type PaletteColor } from './palette';
export { default as theme, darkTheme, layout } from './theme';
export type { Theme } from './theme';
export { fontAssets, fonts, textVariants } from './typography';

export type ThemeColor = keyof Theme['colors'];

/** Typed access to the active restyle theme. */
export const useTheme = () => useRestyleTheme<Theme>();
