export type UserRole = 'Mother' | 'Babysitter' | 'Admin';
export type AccountStatus = 'Active' | 'pendingReview' | 'Rejected' | 'Suspended';

/** Sanitised user as returned by `/users/login`, `/users/me` and profile updates. */
export type User = {
  _id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Gender: string;
  Phone: string;
  zipCode: string;
  Address: string;
  hourlyRate: number | null;
  about: string;
  state: string;
  city: string;
  picture: string;
  sendEmail: boolean;
  sendPhone: boolean;
  no: boolean;
  ratingAverage: number;
  ratingCount: number;
  /** Active dashboard role. */
  role: UserRole;
  /** Every role the account is onboarded for. */
  roles?: UserRole[];
  status: AccountStatus;
  emailVerified?: boolean;
  /** True once at least one device is registered for biometric sign-in. */
  biometricEnabled?: boolean;
  biometricDevices?: BiometricDevice[];
  payoutAccountStatus?: 'not_started' | 'pending' | 'enabled';
  notificationPreferences?: NotificationPreferences;
  createdAt?: string;
  updatedAt?: string;
};

export type BiometricDevice = {
  deviceId: string;
  deviceName: string;
  credentialId?: string;
  publicKey?: string;
  lastUsedAt?: string;
  createdAt?: string;
};

/** A US state as returned by `/users/states`. */
export type UsState = { name: string; abbreviation: string };

export type NotificationPreferences = {
  push: boolean;
  email: boolean;
  booking: boolean;
  payment: boolean;
  chat: boolean;
  marketing: boolean;
};

export type RegisterInput = {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Gender: string;
  Phone: string;
  zipCode: string;
  Address: string;
  role: Exclude<UserRole, 'Admin'>;
  hourlyRate?: number;
};

export type AuthResponse = { message: string; token: string; user: User };
