import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { isValidPhone, validate } from '@/modules/auth/lib/validation';
import { useSession } from '@/modules/auth/session';
import type { PickedFile } from '@/modules/kyc/api';
import { profileApi } from '@/modules/profile/api';
import { OptionList } from '@/shared/components/Field';
import { KeyboardScreen } from '@/shared/components/KeyboardScreen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import { Avatar, Box, Button, Pressable, Text, TextField } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { fullName } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

const genders = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Other', label: 'Prefer not to say' },
];

export function EditProfileScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const { user, setUser, isBabysitter } = useSession();

  const [form, setForm] = useState({
    FirstName: user?.FirstName ?? '',
    LastName: user?.LastName ?? '',
    Phone: user?.Phone ?? '',
    Gender: user?.Gender ?? '',
    Address: user?.Address ?? '',
    zipCode: user?.zipCode ?? '',
    city: user?.city ?? '',
    state: user?.state ?? '',
    about: user?.about ?? '',
    hourlyRate: user?.hourlyRate ? String(user.hourlyRate) : '',
  });
  const [picture, setPicture] = useState<PickedFile | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      return toast.info(
        'Photo access needed',
        'Allow photo access in Settings to change your picture.'
      );
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    const asset = result.assets?.[0];
    if (!result.canceled && asset)
      setPicture({ uri: asset.uri, mimeType: asset.mimeType, fileName: asset.fileName });
  };

  const save = useMutation({
    mutationFn: () =>
      profileApi.update({
        ...form,
        hourlyRate: isBabysitter && form.hourlyRate ? Number(form.hourlyRate) : undefined,
        picture: picture ?? undefined,
      }),
    onSuccess: ({ user: next }) => {
      setUser({ ...user, ...next } as typeof next);
      toast.success('Profile updated');
      router.back();
    },
    onError: (e) => toast.error('Could not save', errorMessage(e)),
  });

  const submit = () => {
    const next = validate({
      FirstName: form.FirstName.trim() ? undefined : 'Required',
      LastName: form.LastName.trim() ? undefined : 'Required',
      Phone: isValidPhone(form.Phone) ? undefined : 'Enter a valid phone number',
      Address: form.Address.trim() ? undefined : 'Required',
      zipCode: form.zipCode.trim() ? undefined : 'Required',
      hourlyRate:
        isBabysitter && !(Number(form.hourlyRate) > 0) ? 'Enter your hourly rate' : undefined,
    });
    setErrors(next);
    if (Object.keys(next).length === 0) save.mutate();
  };

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader title="Edit profile" />
      <KeyboardScreen
        footer={
          <Button onPress={submit} loading={save.isPending} icon="save-outline">
            Save changes
          </Button>
        }>
        <Box alignItems="center" gap="s">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change photo"
            onPress={pickPhoto}>
            <Box>
              <Avatar uri={picture?.uri ?? user?.picture} name={fullName(user)} size={104} ring />
              <Box
                position="absolute"
                bottom={0}
                right={0}
                width={34}
                height={34}
                borderRadius="full"
                backgroundColor="primary"
                alignItems="center"
                justifyContent="center"
                borderWidth={3}
                borderColor="screenBackground">
                <Ionicons name="camera" size={16} color={colors.onPrimary} />
              </Box>
            </Box>
          </Pressable>
          <Text variant="p12" color="textMuted">
            Tap to change your photo
          </Text>
        </Box>

        <Box gap="m">
          <Text variant="overline">Basics</Text>
          <Box flexDirection="row" gap="sm">
            <Box flex={1}>
              <TextField
                label="First name"
                value={form.FirstName}
                onChangeText={set('FirstName')}
                error={errors.FirstName}
              />
            </Box>
            <Box flex={1}>
              <TextField
                label="Last name"
                value={form.LastName}
                onChangeText={set('LastName')}
                error={errors.LastName}
              />
            </Box>
          </Box>
          <TextField
            label="Phone"
            icon="call-outline"
            value={form.Phone}
            onChangeText={set('Phone')}
            error={errors.Phone}
            keyboardType="phone-pad"
          />
          <Box gap="s">
            <Text variant="p14SemiBold">Gender</Text>
            <OptionList options={genders} value={form.Gender} onChange={set('Gender')} />
          </Box>
          <TextField
            label={isBabysitter ? 'About you' : 'About your family'}
            icon="sparkles-outline"
            placeholder={
              isBabysitter
                ? 'Experience, certifications, what you love about childcare…'
                : 'A little about your family and what you look for in a sitter…'
            }
            value={form.about}
            onChangeText={set('about')}
            textArea
          />
        </Box>

        <Box gap="m">
          <Text variant="overline">Location</Text>
          <TextField
            label="Address"
            icon="home-outline"
            value={form.Address}
            onChangeText={set('Address')}
            error={errors.Address}
          />
          <Box flexDirection="row" gap="sm">
            <Box flex={1}>
              <TextField label="City" value={form.city} onChangeText={set('city')} />
            </Box>
            <Box flex={1}>
              <TextField label="State" value={form.state} onChangeText={set('state')} />
            </Box>
          </Box>
          <TextField
            label="ZIP code"
            icon="location-outline"
            value={form.zipCode}
            onChangeText={set('zipCode')}
            error={errors.zipCode}
            keyboardType="number-pad"
          />
        </Box>

        {isBabysitter ? (
          <Box gap="m">
            <Text variant="overline">Rates</Text>
            <TextField
              label="Hourly rate"
              icon="cash-outline"
              value={form.hourlyRate}
              onChangeText={(v) => set('hourlyRate')(v.replace(/[^0-9.]/g, ''))}
              error={errors.hourlyRate}
              keyboardType="decimal-pad"
              trailing={
                <Text variant="p14Medium" color="textMuted">
                  $/hr
                </Text>
              }
            />
          </Box>
        ) : null}
      </KeyboardScreen>
    </Box>
  );
}
