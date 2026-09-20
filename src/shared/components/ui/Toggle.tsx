import { Switch, type SwitchProps } from 'react-native';

import { useTheme } from '@/shared/theme';

/** Native switch tinted with the brand colour. */
export function Toggle(props: SwitchProps) {
  const { colors } = useTheme();
  return (
    <Switch
      trackColor={{ false: colors.borderStrong, true: colors.primary }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.borderStrong}
      {...props}
    />
  );
}
