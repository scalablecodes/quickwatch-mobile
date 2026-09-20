import { useSession } from '@/modules/auth/session';

import { MotherHome } from './MotherHome';
import { SitterHome } from './SitterHome';

/** The Home tab renders the dashboard for the active role. */
export function HomeScreen() {
  const { isBabysitter } = useSession();
  return isBabysitter ? <SitterHome /> : <MotherHome />;
}
