import { io, type Socket } from 'socket.io-client';

import { env } from '@/shared/lib/env';
import { tokenStorage } from '@/shared/lib/storage';

let socket: Socket | null = null;

/** Lazily connect a single authenticated socket for the session. */
export async function getSocket(): Promise<Socket | null> {
  const token = await tokenStorage.get();
  if (!token) return null;
  if (socket?.connected) return socket;
  if (socket) socket.disconnect();
  socket = io(env.apiUrl, { auth: { token }, transports: ['websocket'], reconnectionAttempts: 5 });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
