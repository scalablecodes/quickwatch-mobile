import { api, appendFile } from '@/shared/lib/api';

import type { User } from '@/modules/auth/types';
import type { PickedFile } from '@/modules/kyc/api';

export type ProfileInput = Partial<
  Pick<
    User,
    | 'FirstName'
    | 'LastName'
    | 'Gender'
    | 'Phone'
    | 'zipCode'
    | 'Address'
    | 'about'
    | 'state'
    | 'city'
  >
> & { hourlyRate?: number; picture?: PickedFile };

export const profileApi = {
  update: (input: ProfileInput) => {
    const form = new FormData();
    for (const [key, value] of Object.entries(input)) {
      if (key === 'picture' || value === undefined || value === null) continue;
      form.append(key, String(value));
    }
    if (input.picture) appendFile(form, 'picture', input.picture);
    return api.patch<{ message: string; user: User }>('/users/me/profile', form);
  },
};
