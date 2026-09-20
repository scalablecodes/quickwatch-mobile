/**
 * Raw colour palette for QuickWatch. Do not use these directly in components; map them
 * to semantic tokens in `theme.ts` so light/dark modes stay consistent.
 */
export const Palette = {
  // Brand primary — QuickWatch violet #6F17C1
  violet01: '#6F17C1',
  violet02: '#9A5AE0',
  violet03: '#F1E8FB',
  violet04: '#4E0F8A',
  /** Violet/01 at 12% — selected chips, tinted icon wells. */
  violet01Alpha12: 'rgba(111, 23, 193, 0.12)',
  /** Violet/01 at 35% — focused borders. */
  violet01Alpha35: 'rgba(111, 23, 193, 0.35)',

  // Brand secondary — QuickWatch gold #F9B232, used for accent CTAs and highlights
  gold01: '#F9B232',
  gold02: '#FBC966',
  gold03: '#FEF3DC',

  // Ink
  ink01: '#151433',
  ink02: '#575673',
  ink03: '#8C8BA6',

  grey01: '#B4B3C7',
  grey02: '#D5D4E2',
  grey03: '#E9E8F2',

  lightGrey01: '#F3F2F9',
  lightGrey02: '#F8F7FC',
  lightGrey03: '#FBFBFE',

  white: '#FFFFFF',
  trueBlack: '#000000',
  whiteAlpha10: 'rgba(255, 255, 255, 0.1)',
  whiteAlpha20: 'rgba(255, 255, 255, 0.2)',
  whiteAlpha35: 'rgba(255, 255, 255, 0.35)',
  whiteAlpha70: 'rgba(255, 255, 255, 0.7)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
  blackAlpha20: 'rgba(0, 0, 0, 0.2)',
  blackAlpha50: 'rgba(0, 0, 0, 0.5)',

  // Support
  green01: '#12A66E',
  green02: '#E3F7EE',
  amber01: '#F5A524',
  amber02: '#FFF4DE',
  red01: '#E5484D',
  red02: '#FDE8E9',
  blue01: '#3B82F6',
  blue02: '#E8F0FF',
  star: '#FFB800',

  // Avatar tints
  mint01: '#D6F3E4',
  mint02: '#1F7A55',
  peach01: '#FFE3D6',
  peach02: '#B4532A',
  sky01: '#DCEBFF',
  sky02: '#2456A8',
  lilac01: '#E9DFFF',
  lilac02: '#5A2FBF',

  // Dark surfaces
  dmBlack01: '#0F0E1A',
  dmBlack02: '#1A1929',
  dmBlack03: '#26243A',
  dmBlack04: '#312F48',

  transparent: 'transparent',
} satisfies Record<string, string>;

export type PaletteColor = keyof typeof Palette;
