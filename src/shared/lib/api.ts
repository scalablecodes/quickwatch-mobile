import { logApiCall } from './dev-network-log';
import { env } from './env';
import { tokenStorage } from './storage';

/** Error thrown for non-2xx responses, carrying the API's own message and payload. */
export class ApiError extends Error {
  status: number;
  payload: Record<string, unknown>;

  constructor(status: number, payload: Record<string, unknown>) {
    super(typeof payload.message === 'string' ? payload.message : `Request failed (${status})`);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }

  /** `accountStatus` the API attaches when an account is not Active. */
  get accountStatus(): string | undefined {
    return typeof this.payload.accountStatus === 'string' ? this.payload.accountStatus : undefined;
  }

  get requiresEmailVerification(): boolean {
    return this.payload.requiresEmailVerification === true;
  }
}

type Listener = (error: ApiError) => void;
const unauthorizedListeners = new Set<Listener>();

/** Subscribe to 401s so the session can sign out when a token expires. */
export function onUnauthorized(listener: Listener): () => void {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

type Body = Record<string, unknown> | FormData | undefined;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: Body;
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Skip the bearer header (login/register). */
  anonymous?: boolean;
};

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(path.startsWith('http') ? path : `${env.apiUrl}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/** JSON/multipart fetch wrapper: attaches the bearer token and normalises errors to `ApiError`. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, anonymous = false } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (!anonymous) {
    const token = await tokenStorage.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const url = buildUrl(path, query);
  const startedAt = Date.now();
  const response = await fetch(url, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const text = await response.text();
  let payload: Record<string, unknown> = {};
  if (text) {
    try {
      payload = JSON.parse(text) as Record<string, unknown>;
    } catch {
      payload = { message: text };
    }
  }

  logApiCall({
    url,
    method,
    requestHeaders: headers,
    requestBody: isForm ? '[multipart form data]' : body,
    status: response.status,
    responseHeaders: Object.fromEntries(response.headers.entries()),
    responseBody: payload,
    duration: Date.now() - startedAt,
  });

  if (!response.ok) {
    const error = new ApiError(response.status, payload);
    if (response.status === 401 && !anonymous) unauthorizedListeners.forEach((l) => l(error));
    throw error;
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query']) => request<T>(path, { query }),
  post: <T>(path: string, body?: Body, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: Body, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/** Human-readable message from any thrown value. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message === 'Network request failed') {
    return 'Unable to reach QuickWatch. Check your connection and try again.';
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Appends a picked file to multipart form data in the shape multer expects. */
export function appendFile(
  form: FormData,
  field: string,
  file: { uri: string; mimeType?: string | null; fileName?: string | null }
) {
  const name = file.fileName ?? file.uri.split('/').pop() ?? `${field}.jpg`;
  const type = file.mimeType ?? 'image/jpeg';
  // React Native's FormData accepts { uri, name, type } objects for file parts.
  form.append(field, { uri: file.uri, name, type } as unknown as Blob);
}
