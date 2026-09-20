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
  payoutAccountStatus?: 'not_started' | 'pending' | 'enabled';
  notificationPreferences?: NotificationPreferences;
  createdAt?: string;
  updatedAt?: string;
};

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
