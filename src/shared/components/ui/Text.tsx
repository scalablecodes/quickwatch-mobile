import { createText } from '@shopify/restyle';

import type { Theme } from '@/shared/theme';

/** Themed `Text`: `variant` from `theme.textVariants` plus spacing/colour props. */
const Text = createText<Theme>();

export type TextProps = React.ComponentProps<typeof Text>;

export { Text };
