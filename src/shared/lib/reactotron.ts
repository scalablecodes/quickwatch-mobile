import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import Reactotron from 'reactotron-react-native';
import { QueryClientManager, reactotronReactQuery } from 'reactotron-react-query';

import { queryClient } from './query-client';

/**
 * Reactotron — development only. Loaded from the root layout behind `if (__DEV__)`, so it
 * never runs (or ships meaningfully) in release builds.
 *
 * Open the Reactotron desktop app before starting Metro. On a physical device the app has
 * to reach your Mac, so the host is taken from the Metro URL rather than assuming localhost.
 */

/** Host running the Reactotron desktop app — the same machine serving Metro. */
function resolveHost(): string {
  // e.g. "192.168.0.169:8085" on a device, "localhost:8085" on a simulator.
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost ?? '';
  const host = hostUri.split(':')[0];
  if (host) return host;
  // Android emulators reach the host machine through 10.0.2.2.
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

const queryClientManager = new QueryClientManager({ queryClient });

Reactotron.configure({
  name: 'QuickWatch',
  host: resolveHost(),
  onDisconnect: () => queryClientManager.unsubscribe(),
})
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative({
    networking: {
      // The Metro/symbolicate chatter drowns out the API calls we actually care about.
      ignoreUrls: /symbolicate|127\.0\.0\.1|logs$/,
    },
  })
  .use(reactotronReactQuery(queryClientManager))
  .connect();

// Clear the Reactotron log on every reload so each session starts fresh.
Reactotron.clear?.();

// `console.tron.log(...)` from anywhere while debugging.
declare global {
  interface Console {
    tron: typeof Reactotron;
  }
}
console.tron = Reactotron;

export default Reactotron;
