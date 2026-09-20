import { Redirect } from 'expo-router';

import { useSession } from '@/modules/auth/session';

/** Entry: the auth flow until a session exists, the status screen until Active, then home. */
export default function Index() {
  const { signedIn, active } = useSession();
  if (!signedIn) return <Redirect href="/welcome" />;
  if (!active) return <Redirect href="/account-status" />;
  return <Redirect href="/home" />;
}
