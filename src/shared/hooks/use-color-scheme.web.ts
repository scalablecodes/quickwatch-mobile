import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};

/** Static rendering has no colour scheme; report light until hydrated on the client. */
export function useColorScheme() {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const scheme = useRNColorScheme();
  return hydrated ? scheme : 'light';
}
