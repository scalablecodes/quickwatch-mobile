export type Kyc = {
  _id: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  proofOfAddressUrl: string;
  identityCardUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string;
  reviewedAt: string | null;
  createdAt: string;
};
