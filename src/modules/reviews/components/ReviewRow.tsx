import { Avatar, Box, Stars, Text } from '@/shared/components/ui';
import { formatRelative } from '@/shared/lib/format';

export type ReviewRowProps = {
  name: string;
  picture?: string;
  rating: number;
  comment: string;
  date: string;
};

export function ReviewRow({ name, picture, rating, comment, date }: ReviewRowProps) {
  return (
    <Box gap="s">
      <Box flexDirection="row" alignItems="center" gap="s">
        <Avatar uri={picture} name={name} size={36} />
        <Box flex={1}>
          <Text variant="p14SemiBold">{name}</Text>
          <Text variant="micro">{formatRelative(date)}</Text>
        </Box>
        <Stars value={rating} size={14} />
      </Box>
      {comment ? (
        <Text variant="p14" color="textSecondary">
          {comment}
        </Text>
      ) : null}
    </Box>
  );
}
