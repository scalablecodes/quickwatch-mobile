import {
  createRestyleComponent,
  createVariant,
  type BoxProps as RestyleBoxProps,
  type VariantProps,
} from '@shopify/restyle';
import type { ViewProps } from 'react-native';

import type { Theme } from '@/shared/theme';

import { Box } from './Box';

export type CardProps = RestyleBoxProps<Theme> & VariantProps<Theme, 'cardVariants'> & ViewProps;

/** A `Box` styled by `theme.cardVariants` (`defaults` | `elevated` | `outlined` | `subtle` | `primary`). */
export const Card = createRestyleComponent<CardProps, Theme>(
  [createVariant({ themeKey: 'cardVariants' })],
  Box
);
