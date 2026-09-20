import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import type { ThemeColor } from '@/shared/theme';

import { Box } from './Box';
import { Text } from './Text';

export type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: number;
  /** Ring in the brand colour, e.g. for the signed-in user. */
  ring?: boolean;
};

const tints: { bg: ThemeColor; fg: ThemeColor }[] = [
  { bg: 'avatarLilacBackground', fg: 'avatarLilacText' },
  { bg: 'avatarMintBackground', fg: 'avatarMintText' },
  { bg: 'avatarPeachBackground', fg: 'avatarPeachText' },
  { bg: 'avatarSkyBackground', fg: 'avatarSkyText' },
];

/** Initials from a display name, e.g. "Ada Lovelace" → "AL". */
export function initialsOf(name: string | undefined): string {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Photo when available, otherwise initials on a tint picked deterministically from the name. */
export function Avatar({ uri, name, size = 48, ring = false }: AvatarProps) {
  const seed = (name ?? '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const tint = tints[seed % tints.length] ?? tints[0];
  const fontSize = Math.round(size * 0.36);

  return (
    <Box
      width={size}
      height={size}
      borderRadius="full"
      overflow="hidden"
      backgroundColor={tint?.bg}
      alignItems="center"
      justifyContent="center"
      borderWidth={ring ? 2 : 0}
      borderColor="primary">
      {uri ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          accessibilityLabel={name}
        />
      ) : (
        <Text
          color={tint?.fg}
          style={{
            fontSize,
            lineHeight: Math.round(fontSize * 1.2),
            fontFamily: 'PlusJakartaSans_700Bold',
          }}>
          {initialsOf(name)}
        </Text>
      )}
    </Box>
  );
}
