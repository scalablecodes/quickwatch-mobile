import { api, appendFile } from '@/shared/lib/api';

import type { Kyc } from './types';

export type PickedFile = { uri: string; mimeType?: string | null; fileName?: string | null };

export const kycApi = {
  mine: () => api.get<{ kyc: Kyc | null }>('/kyc/me'),
  submit: (input: {
    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    proofOfAddress: PickedFile;
    identityCard: PickedFile;
  }) => {
    const form = new FormData();
    form.append('address', input.address);
    form.append('emergencyContactName', input.emergencyContactName);
    form.append('emergencyContactPhone', input.emergencyContactPhone);
    appendFile(form, 'proofOfAddress', input.proofOfAddress);
    appendFile(form, 'identityCard', input.identityCard);
    return api.post<{ message: string; kyc: Kyc }>('/kyc', form);
  },
};
