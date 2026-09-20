import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

/**
 * Typography. Plus Jakarta Sans is loaded at runtime via `useFonts(fontAssets)` in the
 * root layout so it also works in Expo Go.
 */

/** Font assets to pass to `useFonts`. */
export const fontAssets = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
};

/** Font family names, by weight, as registered with `useFonts`. */
export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

type Weight = keyof typeof fonts;

/** Paragraph: Regular at 160% line-height, heavier weights at 140%. */
const paragraph = (fontSize: number, weight: Weight) => ({
  fontFamily: fonts[weight],
  fontSize,
  lineHeight: Math.round(fontSize * (weight === 'regular' ? 1.6 : 1.4)),
});

/** Heading: Bold, tight tracking, 125% line-height. */
const heading = (fontSize: number, weight: Weight = 'bold') => ({
  fontFamily: fonts[weight],
  fontSize,
  lineHeight: Math.round(fontSize * 1.25),
  letterSpacing: fontSize >= 24 ? -0.5 : -0.2,
});

export const textVariants = {
  defaults: { ...paragraph(16, 'regular'), color: 'text' },

  // Display & headings
  display: { ...heading(34, 'extraBold'), color: 'text' },
  h1: { ...heading(28), color: 'text' },
  h2: { ...heading(22), color: 'text' },
  h3: { ...heading(18, 'semiBold'), color: 'text' },
  h4: { ...heading(16, 'semiBold'), color: 'text' },
  h5: { ...heading(14, 'semiBold'), color: 'text' },

  // Paragraphs — Regular
  p18: { ...paragraph(18, 'regular'), color: 'text' },
  p16: { ...paragraph(16, 'regular'), color: 'text' },
  p14: { ...paragraph(14, 'regular'), color: 'text' },
  p12: { ...paragraph(12, 'regular'), color: 'text' },

  // Paragraphs — Medium
  p18Medium: { ...paragraph(18, 'medium'), color: 'text' },
  p16Medium: { ...paragraph(16, 'medium'), color: 'text' },
  p14Medium: { ...paragraph(14, 'medium'), color: 'text' },
  p12Medium: { ...paragraph(12, 'medium'), color: 'text' },

  // Paragraphs — SemiBold
  p18SemiBold: { ...paragraph(18, 'semiBold'), color: 'text' },
  p16SemiBold: { ...paragraph(16, 'semiBold'), color: 'text' },
  p14SemiBold: { ...paragraph(14, 'semiBold'), color: 'text' },
  p12SemiBold: { ...paragraph(12, 'semiBold'), color: 'text' },

  // Paragraphs — Bold
  p16Bold: { ...paragraph(16, 'bold'), color: 'text' },
  p14Bold: { ...paragraph(14, 'bold'), color: 'text' },
  p12Bold: { ...paragraph(12, 'bold'), color: 'text' },

  // Utility
  /** Large price / stat figure. */
  stat: { ...heading(26, 'extraBold'), color: 'text' },
  /** Tiny uppercase section label. */
  overline: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    color: 'textMuted',
  },
  micro: { fontFamily: fonts.medium, fontSize: 10, lineHeight: 14, color: 'textMuted' },
  button: { ...paragraph(16, 'semiBold'), color: 'onPrimary' },
  caption: { ...paragraph(12, 'regular'), color: 'textSecondary' },
  link: { ...paragraph(14, 'semiBold'), color: 'link' },
} as const;
