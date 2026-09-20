import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useSession } from '@/modules/auth/session';
import { kycApi, type PickedFile } from '@/modules/kyc/api';
import { KeyboardScreen } from '@/shared/components/KeyboardScreen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import {
  Box,
  Button,
  Card,
  Image,
  Pressable,
  Skeleton,
  StatusPill,
  Text,
  TextField,
  type IoniconName,
} from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { formatDate } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

/** Identity verification: status card, and the submission form when none is pending/approved. */
export function VerificationScreen() {
  const toast = useToast();
  const { colors } = useTheme();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const kyc = useQuery({ queryKey: ['kyc'], queryFn: async () => (await kycApi.mine()).kyc });

  const [address, setAddress] = useState(user?.Address ?? '');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [proof, setProof] = useState<PickedFile | null>(null);
  const [idCard, setIdCard] = useState<PickedFile | null>(null);
  const [showForm, setShowForm] = useState(false);

  const pick = async (setter: (f: PickedFile) => void) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.info('Photo access needed', 'Allow photo access in Settings to upload documents.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    const asset = result.assets?.[0];
    if (!result.canceled && asset) {
      setter({ uri: asset.uri, mimeType: asset.mimeType, fileName: asset.fileName });
    }
  };

  const submit = useMutation({
    mutationFn: () =>
      kycApi.submit({
        address: address.trim(),
        emergencyContactName: contactName.trim(),
        emergencyContactPhone: contactPhone.trim(),
        proofOfAddress: proof as PickedFile,
        identityCard: idCard as PickedFile,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      setShowForm(false);
      toast.success('Documents submitted', 'We’ll review them and let you know.');
    },
    onError: (e) => toast.error('Could not submit', errorMessage(e)),
  });

  const status = kyc.data?.status;
  const canSubmit = Boolean(
    address.trim() && contactName.trim() && contactPhone.trim() && proof && idCard
  );
  const formVisible = !kyc.isLoading && (showForm || !kyc.data);

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title="Identity verification" />
      <KeyboardScreen
        footer={
          formVisible ? (
            <Button
              onPress={() => submit.mutate()}
              loading={submit.isPending}
              disabled={!canSubmit}
              icon="cloud-upload-outline">
              Submit for review
            </Button>
          ) : undefined
        }>
        {kyc.isLoading ? (
          <Skeleton height={150} radius={20} />
        ) : kyc.data ? (
          <Animated.View entering={FadeInDown.duration(400)}>
            <Card variant="elevated" gap="sm">
              <Box flexDirection="row" alignItems="center" gap="sm">
                <Box
                  width={48}
                  height={48}
                  borderRadius="l"
                  backgroundColor={
                    status === 'approved'
                      ? 'successSoft'
                      : status === 'rejected'
                        ? 'dangerSoft'
                        : 'warningSoft'
                  }
                  alignItems="center"
                  justifyContent="center">
                  <Ionicons
                    name={
                      status === 'approved'
                        ? 'shield-checkmark'
                        : status === 'rejected'
                          ? 'shield-outline'
                          : 'hourglass'
                    }
                    size={24}
                    color={
                      status === 'approved'
                        ? colors.success
                        : status === 'rejected'
                          ? colors.danger
                          : colors.warning
                    }
                  />
                </Box>
                <Box flex={1} gap="xxs">
                  <Text variant="h4">
                    {status === 'approved'
                      ? 'Verified'
                      : status === 'rejected'
                        ? 'Not approved'
                        : 'Under review'}
                  </Text>
                  <Text variant="p12" color="textMuted">
                    Submitted {formatDate(kyc.data.createdAt)}
                  </Text>
                </Box>
                <StatusPill
                  label={
                    status === 'approved'
                      ? 'Approved'
                      : status === 'rejected'
                        ? 'Rejected'
                        : 'Pending'
                  }
                  tone={
                    status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning'
                  }
                />
              </Box>
              {status === 'rejected' && kyc.data.rejectionReason ? (
                <Box backgroundColor="dangerSoft" borderRadius="m" padding="sm">
                  <Text variant="p12Medium" color="danger">
                    {kyc.data.rejectionReason}
                  </Text>
                </Box>
              ) : null}
              {status === 'rejected' && !showForm ? (
                <Button variant="secondary" size="md" onPress={() => setShowForm(true)}>
                  Resubmit documents
                </Button>
              ) : null}
            </Card>
          </Animated.View>
        ) : null}

        {formVisible ? (
          <Animated.View entering={FadeInDown.delay(60).duration(400)}>
            <Box gap="m">
              <Box gap="xs">
                <Text variant="h3">Verify your identity</Text>
                <Text variant="p14" color="textSecondary">
                  A verified badge builds trust with{' '}
                  {user?.role === 'Babysitter' ? 'families' : 'sitters'}. Your documents are only
                  seen by our review team.
                </Text>
              </Box>
              <TextField
                label="Home address"
                icon="home-outline"
                value={address}
                onChangeText={setAddress}
              />
              <TextField
                label="Emergency contact name"
                icon="person-outline"
                placeholder="Who should we call?"
                value={contactName}
                onChangeText={setContactName}
              />
              <TextField
                label="Emergency contact phone"
                icon="call-outline"
                placeholder="+1 555 000 0000"
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
              />
              <Box flexDirection="row" gap="sm">
                <Upload
                  label="Government ID"
                  icon="card-outline"
                  file={idCard}
                  onPress={() => pick(setIdCard)}
                />
                <Upload
                  label="Proof of address"
                  icon="document-text-outline"
                  file={proof}
                  onPress={() => pick(setProof)}
                />
              </Box>
            </Box>
          </Animated.View>
        ) : null}
      </KeyboardScreen>
    </Box>
  );
}

function Upload({
  label,
  icon,
  file,
  onPress,
}: {
  label: string;
  icon: IoniconName;
  file: PickedFile | null;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Upload ${label}`}
      onPress={onPress}
      style={{ flex: 1 }}>
      <Box
        height={140}
        borderRadius="l"
        borderWidth={1.5}
        borderColor={file ? 'primary' : 'borderStrong'}
        backgroundColor={file ? 'cardBackground' : 'inputBackground'}
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        gap="s"
        style={{ borderStyle: file ? 'solid' : 'dashed' }}>
        {file ? (
          <>
            <Image source={{ uri: file.uri }} width="100%" height="100%" contentFit="cover" />
            <Box
              position="absolute"
              bottom={8}
              right={8}
              width={26}
              height={26}
              borderRadius="full"
              backgroundColor="primary"
              alignItems="center"
              justifyContent="center">
              <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
            </Box>
          </>
        ) : (
          <>
            <Ionicons name={icon} size={28} color={colors.primary} />
            <Text variant="p12SemiBold" textAlign="center">
              {label}
            </Text>
            <Text variant="micro">Tap to upload</Text>
          </>
        )}
      </Box>
    </Pressable>
  );
}
