import { createBox } from '@shopify/restyle';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';

import type { Theme } from '@/shared/theme';

const TouchableOpacity = createBox<
  Theme,
  React.ComponentProps<typeof RNTouchableOpacity> & { children?: React.ReactNode }
>(RNTouchableOpacity);

export type TouchableOpacityProps = React.ComponentProps<typeof TouchableOpacity>;

export { TouchableOpacity };
