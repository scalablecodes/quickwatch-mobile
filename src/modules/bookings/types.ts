import type { User } from '@/modules/auth/types';

export type LifecycleStatus =
  'requested' | 'accepted' | 'declined' | 'inProgress' | 'completed' | 'cancelled' | 'refunded';

export type PaymentStatus = 'not_started' | 'pending' | 'paid' | 'failed';
export type PayoutStatus = 'not_ready' | 'requested' | 'paid';

/** A participant as populated by the bookings endpoints. */
export type Participant = Pick<User, '_id' | 'FirstName' | 'LastName' | 'picture'> &
  Partial<
    Pick<
      User,
      'Email' | 'status' | 'hourlyRate' | 'ratingAverage' | 'ratingCount' | 'city' | 'state'
    >
  >;

export type Booking = {
  _id: string;
  selectedStartDate: string;
  startTime: string;
  endTime: string;
  watcherRole: string;
  motherName: string;
  childNo: number;
  childOption2: string;
  rateHour: string;
  requestedAmount: number;
  companyFeePerHour: number;
  sitterHourlyRate: number;
  serviceAmount: number;
  companyFee: number;
  totalAmount: number;
  childrenDescription: string;
  specialInstructions: string;
  email: string;
  emailTo: string;
  location: string;
  address: string;
  zipcode: string;
  picture: string;
  watcherName: string;
  status: boolean;
  confirm: boolean;
  lifecycleStatus: LifecycleStatus;
  cancellationReason: string;
  cancelledAt: string | null;
  paymentStatus: PaymentStatus;
  motherConfirmedAt: string | null;
  payoutStatus: PayoutStatus;
  payoutRequestedAt: string | null;
  acceptedAt: string | null;
  /** Populated participant, or a bare id on write responses. */
  mother: Participant | string | null;
  babysitter: Participant | string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingInput = {
  selectedStartDate: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  zipcode?: string;
  childNo: number;
  childOption2?: string;
  childrenDescription?: string;
  specialInstructions?: string;
  requestedAmount: number;
  rateHour?: string;
  motherName?: string;
  picture?: string;
  babysitterId?: string;
  emailTo?: string;
  watcherName?: string;
};

export type UpdateBookingDetailsInput = Partial<
  Pick<
    CreateBookingInput,
    | 'selectedStartDate'
    | 'startTime'
    | 'endTime'
    | 'location'
    | 'address'
    | 'zipcode'
    | 'childNo'
    | 'childrenDescription'
    | 'specialInstructions'
    | 'requestedAmount'
  >
>;

export type PaymentSummary = {
  serviceAmount: number;
  companyFee: number;
  totalAmount: number;
  currency: string;
};
