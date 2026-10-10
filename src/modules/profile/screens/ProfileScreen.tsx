import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getStoredCredential } from '@/modules/auth/biometrics';
import { useSession } from '@/modules/auth/session';
import { useTabBarInset } from '@/shared/components/AppTabs';
import {
  Avatar,
  Box,
  Card,
  Divider,
  ListRow,
  Pressable,
  ScrollBox,
  Stars,
  StatusPill,
  Text,
} from '@/shared/components/ui';
import { formatMoney, fullName } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

/** "Profile" tab: identity card, role switcher and settings rows. */
export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const { colors } = useTheme();
  const { user, isBabysitter, signOut } = useSession();
  const [biometricOn, setBiometricOn] = useState(false);

  useEffect(() => {
    getStoredCredential().then((c) => setBiometricOn(Boolean(c)));
  }, []);

  if (!user) return null;

  const roles = user.roles ?? [user.role];
  const otherRole = user.role === 'Mother' ? 'Babysitter' : 'Mother';
  const hasOtherRole = roles.includes(otherRole);

  const confirmSignOut = () =>
    Alert.alert('Log out', 'You can log back in any time.', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => signOut() },
    ]);

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScrollBox
        flex={1}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: bottomInset,
          gap: 14,
        }}
        showsVerticalScrollIndicator={false}>
        <Text variant="h1">Profile</Text>

        <Animated.View entering={FadeInDown.duration(400)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            pressScale={0.99}
            onPress={() => router.push('/settings/edit-profile')}>
            <Card variant="elevated" flexDirection="row" alignItems="center" gap="m">
              <Avatar uri={user.picture} name={fullName(user)} size={64} ring />
              <Box flex={1} gap="xxs">
                <Text variant="h3" numberOfLines={1}>
                  {fullName(user)}
                </Text>
                <Text variant="p12" color="textMuted" numberOfLines={1}>
                  {user.Email}
                </Text>
                <Box flexDirection="row" alignItems="center" gap="s" marginTop="xxs">
                  <StatusPill label={isBabysitter ? 'Babysitter' : 'Parent'} tone="primary" />
                  {user.ratingCount ? (
                    <Box flexDirection="row" alignItems="center" gap="xxs">
                      <Stars value={user.ratingAverage} size={12} />
                      <Text variant="micro">{user.ratingAverage.toFixed(1)}</Text>
                    </Box>
                  ) : null}
                </Box>
              </Box>
              <Ionicons name="create-outline" size={20} color={colors.textMuted} />
            </Card>
          </Pressable>
        </Animated.View>

        {isBabysitter ? (
          <Animated.View entering={FadeInUp.delay(60).duration(400)}>
            <Box flexDirection="row" gap="sm">
              <Card flex={1} gap="xxs" padding="sm">
                <Text variant="micro">Hourly rate</Text>
                <Text variant="h3">{formatMoney(user.hourlyRate)}</Text>
              </Card>
              <Card flex={1} gap="xxs" padding="sm">
                <Text variant="micro">Reviews</Text>
                <Text variant="h3">{user.ratingCount}</Text>
              </Card>
              <Card flex={1} gap="xxs" padding="sm">
                <Text variant="micro">Payouts</Text>
                <Text
                  variant="h3"
                  color={user.payoutAccountStatus === 'enabled' ? 'success' : 'warning'}>
                  {user.payoutAccountStatus === 'enabled' ? 'On' : 'Off'}
                </Text>
              </Card>
            </Box>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInUp.delay(120).duration(400)}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/settings/switch-role')}>
            <Card variant="primary" flexDirection="row" alignItems="center" gap="sm" padding="m">
              <Box
                width={40}
                height={40}
                borderRadius="m"
                backgroundColor="overlaySoft"
                alignItems="center"
                justifyContent="center">
                <Ionicons name="swap-horizontal" size={20} color={colors.onPrimary} />
              </Box>
              <Box flex={1}>
                <Text variant="p14SemiBold" color="onPrimary">
                  {hasOtherRole
                    ? `Switch to ${otherRole === 'Mother' ? 'parent' : 'babysitter'} mode`
                    : otherRole === 'Mother'
                      ? 'Also need a sitter?'
                      : 'Want to babysit too?'}
                </Text>
                <Text variant="p12" color="onPrimaryMuted">
                  {hasOtherRole
                    ? 'Use the same account for both.'
                    : `Add the ${otherRole === 'Mother' ? 'parent' : 'babysitter'} role to this account.`}
                </Text>
              </Box>
              <Ionicons name="chevron-forward" size={18} color={colors.onPrimaryMuted} />
            </Card>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(400)}>
          <Card>
            <Text variant="overline" marginBottom="xs">
              Account
            </Text>
            <ListRow
              icon="person-outline"
              title="Personal details"
              subtitle="Name, phone, address, bio"
              onPress={() => router.push('/settings/edit-profile')}
            />
            <Divider />
            <ListRow
              icon="shield-checkmark-outline"
              title="Identity verification"
              subtitle="ID and proof of address"
              onPress={() => router.push('/settings/verification')}
            />
            <Divider />
            <ListRow
              icon="finger-print-outline"
              title="Biometric sign-in"
              subtitle={
                biometricOn ? 'Enabled on this device' : 'Use Face ID or fingerprint to log in'
              }
              onPress={() => router.push('/settings/biometric')}
            />
            <Divider />
            <ListRow
              icon="notifications-outline"
              title="Notifications"
              subtitle="What we alert you about"
              onPress={() => router.push('/settings/notifications')}
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(240).duration(400)}>
          <Card>
            <Text variant="overline" marginBottom="xs">
              Money
            </Text>
            <ListRow
              icon="receipt-outline"
              title={isBabysitter ? 'Earnings' : 'Payment history'}
              subtitle={isBabysitter ? 'What you’ve earned per job' : 'Receipts for your bookings'}
              iconColor="success"
              iconBackground="successSoft"
              onPress={() => router.push('/settings/payments')}
            />
            {isBabysitter ? (
              <>
                <Divider />
                <ListRow
                  icon="wallet-outline"
                  title="Payout account"
                  subtitle={
                    user.payoutAccountStatus === 'enabled' ? 'Connected' : 'Connect a bank account'
                  }
                  iconColor="success"
                  iconBackground="successSoft"
                  onPress={() => router.push('/settings/payouts')}
                />
              </>
            ) : null}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Card>
            <Text variant="overline" marginBottom="xs">
              Support
            </Text>
            <ListRow
              icon="help-buoy-outline"
              title="Help & support"
              iconColor="info"
              iconBackground="infoSoft"
              onPress={() => router.push('/settings/support')}
            />
            <Divider />
            <ListRow
              icon="document-text-outline"
              title="Terms & privacy"
              iconColor="info"
              iconBackground="infoSoft"
              onPress={() => router.push('/terms')}
            />
            <Divider />
            <ListRow icon="log-out-outline" title="Log out" destructive onPress={confirmSignOut} />
          </Card>
        </Animated.View>

        <Text variant="micro" textAlign="center">
          QuickWatch v2.0.0
        </Text>
      </ScrollBox>
    </Box>
  );
}
