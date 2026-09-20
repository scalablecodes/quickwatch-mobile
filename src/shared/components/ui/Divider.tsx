import { Box, type BoxProps } from './Box';

/** 1pt hairline in the theme border colour. */
export function Divider(props: BoxProps) {
  return <Box height={1} backgroundColor="border" alignSelf="stretch" {...props} />;
}
