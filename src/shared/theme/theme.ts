import { createTheme } from '@shopify/restyle';
import { Platform } from 'react-native';

import { Palette } from './palette';
import { textVariants } from './typography';

/** Layout constants that are not theme tokens but are shared across screens. */
export const layout = {
  /** Height reserved for the floating tab bar, used to pad scrollable content. */
  bottomTabInset: Platform.select({ ios: 90, android: 96 }) ?? 96,
  maxContentWidth: 800,
  screenPadding: 20,
} as const;

const theme = createTheme({
  colors: {
    // Surfaces
    mainBackground: Palette.white,
    screenBackground: Palette.lightGrey02,
    cardBackground: Palette.white,
    cardBackgroundSubtle: Palette.lightGrey01,
    selectedBackground: Palette.grey03,
    border: Palette.grey03,
    borderStrong: Palette.grey02,
    skeleton: Palette.lightGrey01,
    skeletonHighlight: Palette.grey03,

    // Text
    text: Palette.ink01,
    textSecondary: Palette.ink02,
    textMuted: Palette.ink03,
    textHint: Palette.grey01,
    textInverse: Palette.white,
    link: Palette.violet01,
    onPrimary: Palette.white,
    onPrimaryMuted: Palette.whiteAlpha70,
    /** Ink on gold — white fails contrast on the secondary colour. */
    onAccent: Palette.ink01,

    // Form fields
    inputBackground: Palette.lightGrey01,
    inputBorder: Palette.lightGrey01,
    inputBorderFilled: Palette.grey03,

    // Brand
    primary: Palette.violet01,
    primaryLight: Palette.violet02,
    primaryDark: Palette.violet04,
    primarySoft: Palette.violet03,
    primaryTint: Palette.violet01Alpha12,
    primaryBorder: Palette.violet01Alpha35,
    accent: Palette.gold01,
    accentLight: Palette.gold02,
    accentSoft: Palette.gold03,

    // Status
    success: Palette.green01,
    successSoft: Palette.green02,
    warning: Palette.amber01,
    warningSoft: Palette.amber02,
    danger: Palette.red01,
    dangerSoft: Palette.red02,
    info: Palette.blue01,
    infoSoft: Palette.blue02,
    rating: Palette.star,

    // Overlays
    overlayFaint: Palette.whiteAlpha10,
    overlaySoft: Palette.whiteAlpha20,
    overlayBorder: Palette.whiteAlpha35,
    frosted: Palette.whiteAlpha90,
    scrim: Palette.blackAlpha50,
    imageScrim: Palette.blackAlpha20,
    tabBar: Palette.ink01,
    tabBarActive: Palette.violet01,

    // Avatar tints
    avatarMintBackground: Palette.mint01,
    avatarMintText: Palette.mint02,
    avatarPeachBackground: Palette.peach01,
    avatarPeachText: Palette.peach02,
    avatarSkyBackground: Palette.sky01,
    avatarSkyText: Palette.sky02,
    avatarLilacBackground: Palette.lilac01,
    avatarLilacText: Palette.lilac02,

    // Raw
    white: Palette.white,
    black: Palette.ink01,
    transparent: Palette.transparent,
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    ml: 20,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadii: {
    none: 0,
    xs: 4,
    s: 8,
    m: 12,
    field: 14,
    l: 16,
    xl: 20,
    sheet: 24,
    xxl: 28,
    full: 9999,
  },
  zIndices: {
    base: 0,
    dropdown: 10,
    overlay: 100,
    modal: 1000,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants,
  cardVariants: {
    defaults: {
      backgroundColor: 'cardBackground',
      borderRadius: 'xl',
      padding: 'm',
    },
    elevated: {
      backgroundColor: 'cardBackground',
      borderRadius: 'xl',
      padding: 'm',
      shadowColor: 'black',
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
      elevation: 3,
    },
    outlined: {
      backgroundColor: 'cardBackground',
      borderRadius: 'xl',
      padding: 'm',
      borderWidth: 1,
      borderColor: 'border',
    },
    subtle: {
      backgroundColor: 'cardBackgroundSubtle',
      borderRadius: 'xl',
      padding: 'm',
    },
    primary: {
      backgroundColor: 'primary',
      borderRadius: 'sheet',
      padding: 'ml',
    },
  },
});

export type Theme = typeof theme;

/** Dark mode. */
export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackground: Palette.dmBlack01,
    screenBackground: Palette.dmBlack01,
    cardBackground: Palette.dmBlack02,
    cardBackgroundSubtle: Palette.dmBlack03,
    selectedBackground: Palette.dmBlack03,
    border: Palette.dmBlack03,
    borderStrong: Palette.dmBlack04,
    skeleton: Palette.dmBlack02,
    skeletonHighlight: Palette.dmBlack03,

    text: Palette.white,
    textSecondary: Palette.grey02,
    textMuted: Palette.grey01,
    textHint: Palette.ink03,
    textInverse: Palette.ink01,
    link: Palette.violet02,

    inputBackground: Palette.dmBlack02,
    inputBorder: Palette.dmBlack02,
    inputBorderFilled: Palette.dmBlack04,

    primarySoft: Palette.dmBlack03,
    primaryTint: 'rgba(154, 90, 224, 0.2)',
    accentSoft: Palette.dmBlack03,
    successSoft: 'rgba(18, 166, 110, 0.18)',
    warningSoft: 'rgba(245, 165, 36, 0.18)',
    dangerSoft: 'rgba(229, 72, 77, 0.18)',
    infoSoft: 'rgba(59, 130, 246, 0.18)',
    frosted: 'rgba(26, 25, 41, 0.9)',
    tabBar: Palette.dmBlack03,

    avatarMintBackground: 'rgba(31, 122, 85, 0.25)',
    avatarMintText: Palette.mint01,
    avatarPeachBackground: 'rgba(180, 83, 42, 0.25)',
    avatarPeachText: Palette.peach01,
    avatarSkyBackground: 'rgba(36, 86, 168, 0.25)',
    avatarSkyText: Palette.sky01,
    avatarLilacBackground: 'rgba(90, 47, 191, 0.25)',
    avatarLilacText: Palette.lilac01,
  },
};

export default theme;
