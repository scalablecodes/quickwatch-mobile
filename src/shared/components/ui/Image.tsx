import { createBox } from '@shopify/restyle';
import { Image as ExpoImage } from 'expo-image';

import type { Theme } from '@/shared/theme';

/** `expo-image` with restyle layout props (`width`, `borderRadius`, …). */
const Image = createBox<Theme, React.ComponentProps<typeof ExpoImage>>(ExpoImage);

export type ImageProps = React.ComponentProps<typeof Image>;

export { Image };
