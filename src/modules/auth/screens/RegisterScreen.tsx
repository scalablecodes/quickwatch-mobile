import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

import { authApi } from '@/modules/auth/api';
import { AuthHeading } from '@/modules/auth/components/AuthHeading';
import { RoleCard } from '@/modules/auth/components/RoleCard';
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidZip,
  validate,
  type FieldErrors,
} from '@/modules/auth/lib/validation';
import type { UserRole } from '@/modules/auth/types';
import { OptionList } from '@/shared/components/Field';
import { KeyboardScreen } from '@/shared/components/KeyboardScreen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useToast } from '@/shared/components/Toast';
import { Box, Button, Text, TextField } from '@/shared/components/ui';
import { errorMessage } from '@/shared/lib/api';
import { useTheme } from '@/shared/theme';

type Role = Exclude<UserRole, 'Admin'>;
type Step = 'role' | 'account' | 'details';
type Field =
  | 'FirstName'
  | 'LastName'
  | 'Email'
  | 'Password'
  | 'Phone'
  | 'Gender'
  | 'Address'
  | 'zipCode'
  | 'hourlyRate';

const STEPS: Step[] = ['role', 'account', 'details'];
const genders = [
  { value: 'Female', label: 'Female', icon: 'female' as const },
  { value: 'Male', label: 'Male', icon: 'male' as const },
  { value: 'Other', label: 'Prefer not to say', icon: 'person' as const },
];

/** Three-step sign-up: role → account → details (+ hourly rate for sitters). */
export function RegisterScreen() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ role?: string }>();
  const { colors } = useTheme();

  const [step, setStep] = useState<Step>(
    params.role === 'Mother' || params.role === 'Babysitter' ? 'account' : 'role'
  );
  const [role, setRole] = useState<Role>(params.role === 'Babysitter' ? 'Babysitter' : 'Mother');
  const [form, setForm] = useState<Record<Field, string>>({
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    Phone: '',
    Gender: '',
    Address: '',
    zipCode: '',
    hourlyRate: '',
  });
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (field: Field) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const register = useMutation({
    mutationFn: () =>
      authApi.register({
        FirstName: form.FirstName.trim(),
        LastName: form.LastName.trim(),
        Email: form.Email.trim().toLowerCase(),
        Password: form.Password,
        Gender: form.Gender,
        Phone: form.Phone.trim(),
        zipCode: form.zipCode.trim(),
        Address: form.Address.trim(),
        role,
        hourlyRate: role === 'Babysitter' ? Number(form.hourlyRate) : undefined,
      }),
    onSuccess: () => {
      router.replace({
        pathname: '/verify-email',
        params: { email: form.Email.trim().toLowerCase(), role },
      });
    },
    onError: (error) => toast.error('Could not create account', errorMessage(error)),
  });

  const validateAccount = () =>
    validate<Field>({
      FirstName: form.FirstName.trim() ? undefined : 'Required',
      LastName: form.LastName.trim() ? undefined : 'Required',
      Email: isValidEmail(form.Email) ? undefined : 'Enter a valid email address',
      Password: isValidPassword(form.Password) ? undefined : 'At least 6 characters',
      Phone: undefined,
      Gender: undefined,
      Address: undefined,
      zipCode: undefined,
      hourlyRate: undefined,
    });

  const validateDetails = () =>
    validate<Field>({
      FirstName: undefined,
      LastName: undefined,
      Email: undefined,
      Password: undefined,
      Phone: isValidPhone(form.Phone) ? undefined : 'Enter a valid phone number',
      Gender: form.Gender ? undefined : 'Choose an option',
      Address: form.Address.trim() ? undefined : 'Required',
      zipCode: isValidZip(form.zipCode) ? undefined : 'Enter a valid ZIP code',
      hourlyRate:
        role === 'Babysitter' && !(Number(form.hourlyRate) > 0)
          ? 'Enter your hourly rate'
          : undefined,
    });

  const next = () => {
    if (step === 'role') return setStep('account');
    if (step === 'account') {
      const e = validateAccount();
      setErrors(e);
      if (Object.keys(e).length === 0) setStep('details');
      return;
    }
    const e = validateDetails();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (!agreed) {
      toast.info('Please accept the terms to continue');
      return;
    }
    register.mutate();
  };

  const back = () => {
    const index = STEPS.indexOf(step);
    if (index === 0 || (index === 1 && params.role)) return router.back();
    setStep(STEPS[index - 1] ?? 'role');
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <Box flex={1} backgroundColor="screenBackground">
      <ScreenHeader onBack={back} right={<StepDots current={stepIndex} total={STEPS.length} />} />
      <KeyboardScreen
        footer={
          <Button
            onPress={next}
            loading={register.isPending}
            trailingIcon={step === 'details' ? undefined : 'arrow-forward'}>
            {step === 'details' ? 'Create account' : 'Continue'}
          </Button>
        }>
        {step === 'role' && (
          <Animated.View
            key="role"
            entering={FadeInRight.duration(350)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition}>
            <Box gap="l">
              <AuthHeading
                title="How will you use QuickWatch?"
                subtitle="You can add the other role later from your profile."
              />
              <Box gap="sm">
                <RoleCard
                  title="I'm a parent"
                  description="Find and book verified babysitters near me."
                  icon="people"
                  selected={role === 'Mother'}
                  onPress={() => setRole('Mother')}
                />
                <RoleCard
                  title="I'm a babysitter"
                  description="Accept requests, chat with families and get paid."
                  icon="heart"
                  selected={role === 'Babysitter'}
                  onPress={() => setRole('Babysitter')}
                />
              </Box>
            </Box>
          </Animated.View>
        )}

        {step === 'account' && (
          <Animated.View
            key="account"
            entering={FadeInRight.duration(350)}
            exiting={FadeOutLeft.duration(200)}>
            <Box gap="m">
              <AuthHeading
                title={role === 'Babysitter' ? 'Join as a babysitter' : 'Create your account'}
                subtitle="Tell us who you are and how to reach you."
              />
              <Box flexDirection="row" gap="sm">
                <Box flex={1}>
                  <TextField
                    label="First name"
                    icon="person-outline"
                    placeholder="Ada"
                    value={form.FirstName}
                    onChangeText={set('FirstName')}
                    error={errors.FirstName}
                    autoComplete="given-name"
                    textContentType="givenName"
                  />
                </Box>
                <Box flex={1}>
                  <TextField
                    label="Last name"
                    placeholder="Lovelace"
                    value={form.LastName}
                    onChangeText={set('LastName')}
                    error={errors.LastName}
                    autoComplete="family-name"
                    textContentType="familyName"
                  />
                </Box>
              </Box>
              <TextField
                label="Email"
                icon="mail-outline"
                placeholder="you@example.com"
                value={form.Email}
                onChangeText={set('Email')}
                error={errors.Email}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
              />
              <TextField
                label="Password"
                icon="lock-closed-outline"
                placeholder="At least 6 characters"
                value={form.Password}
                onChangeText={set('Password')}
                error={errors.Password}
                secureTextEntry={!showPassword}
                trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                trailingIconAccessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                onTrailingIconPress={() => setShowPassword((v) => !v)}
                autoCapitalize="none"
                autoComplete="off"
                textContentType="none"
              />
            </Box>
          </Animated.View>
        )}

        {step === 'details' && (
          <Animated.View
            key="details"
            entering={FadeInRight.duration(350)}
            exiting={FadeOutLeft.duration(200)}>
            <Box gap="m">
              <AuthHeading
                title="A few more details"
                subtitle="Families see your area, never your exact address."
              />
              <TextField
                label="Phone"
                icon="call-outline"
                placeholder="+1 555 000 0000"
                value={form.Phone}
                onChangeText={set('Phone')}
                error={errors.Phone}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
              />
              <Box gap="s">
                <Text variant="p14SemiBold">Gender</Text>
                <OptionList options={genders} value={form.Gender} onChange={set('Gender')} />
                {errors.Gender ? (
                  <Text variant="p12Medium" color="danger">
                    {errors.Gender}
                  </Text>
                ) : null}
              </Box>
              <TextField
                label="Home address"
                icon="home-outline"
                placeholder="Street, city, state"
                value={form.Address}
                onChangeText={set('Address')}
                error={errors.Address}
                autoComplete="street-address"
                textContentType="fullStreetAddress"
              />
              <TextField
                label="ZIP code"
                icon="location-outline"
                placeholder="10001"
                value={form.zipCode}
                onChangeText={set('zipCode')}
                error={errors.zipCode}
                keyboardType="number-pad"
                autoComplete="postal-code"
                textContentType="postalCode"
              />
              {role === 'Babysitter' ? (
                <TextField
                  label="Hourly rate"
                  icon="cash-outline"
                  placeholder="20"
                  value={form.hourlyRate}
                  onChangeText={set('hourlyRate')}
                  error={errors.hourlyRate}
                  keyboardType="decimal-pad"
                  helper="What you charge per hour, in USD. You can change this later."
                  trailing={
                    <Text variant="p14Medium" color="textMuted">
                      $/hr
                    </Text>
                  }
                />
              ) : null}
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: agreed }}
                onPress={() => setAgreed((v) => !v)}
                style={styles.terms}>
                <Box
                  width={22}
                  height={22}
                  borderRadius="xs"
                  borderWidth={2}
                  borderColor={agreed ? 'primary' : 'borderStrong'}
                  backgroundColor={agreed ? 'primary' : 'transparent'}
                  alignItems="center"
                  justifyContent="center">
                  {agreed ? <Ionicons name="checkmark" size={14} color={colors.onPrimary} /> : null}
                </Box>
                <Text variant="p14" color="textSecondary" style={styles.termsText}>
                  I agree to the{' '}
                  <Text variant="p14SemiBold" color="primary" onPress={() => router.push('/terms')}>
                    Terms of Service
                  </Text>{' '}
                  and Privacy Policy.
                </Text>
              </Pressable>
              {role === 'Babysitter' ? (
                <Box backgroundColor="infoSoft" borderRadius="l" padding="m" gap="xxs">
                  <Text variant="p14SemiBold" color="info">
                    Sitter applications are reviewed
                  </Text>
                  <Text variant="p12" color="textSecondary">
                    After verifying your email, our team reviews your profile before you can accept
                    bookings. This usually takes a day or two.
                  </Text>
                </Box>
              ) : null}
            </Box>
          </Animated.View>
        )}
      </KeyboardScreen>
    </Box>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <Box flexDirection="row" alignItems="center" gap="xs" paddingRight="xs">
      {Array.from({ length: total }, (_, i) => (
        <Animated.View key={i} layout={LinearTransition.springify()}>
          <Box
            height={6}
            width={i === current ? 18 : 6}
            borderRadius="full"
            backgroundColor={i <= current ? 'primary' : 'borderStrong'}
          />
        </Animated.View>
      ))}
    </Box>
  );
}

const styles = StyleSheet.create({
  terms: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  termsText: { flex: 1 },
});
