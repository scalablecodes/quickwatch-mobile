/**
 * Dev-only API logging for Reactotron.
 *
 * Reactotron's networking plugin monkey-patches `XMLHttpRequest`, which is fragile across
 * React Native versions and shows nothing useful when it misses. Every call in this app goes
 * through `request()` in `./api`, so we report from there instead: exact method, URL, request
 * headers and body, and the response status/headers/body.
 *
 * Reactotron is reached through `console.tron` (set in `./reactotron`) rather than imported,
 * so the dev dependency never enters the production module graph.
 */

type ReactotronLike = {
  apiResponse?: (
    request: { url: string; method: string; data?: unknown; headers?: Record<string, string> },
    response: { body?: unknown; status: number; headers?: Record<string, string> },
    duration: number
  ) => void;
};

export type ApiLogEntry = {
  url: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBody?: unknown;
  status: number;
  responseHeaders: Record<string, string>;
  responseBody?: unknown;
  /** Milliseconds from send to parsed response. */
  duration: number;
};

/** Bearer tokens and card data must never be echoed into a log. */
function redact(headers: Record<string, string>): Record<string, string> {
  const safe: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    safe[key] = /^authorization$/i.test(key) ? 'Bearer ***' : value;
  }
  return safe;
}

function redactBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body;
  const clone: Record<string, unknown> = { ...(body as Record<string, unknown>) };
  for (const key of Object.keys(clone)) {
    if (/password|token|secret|cvc|cardnumber/i.test(key)) clone[key] = '***';
  }
  return clone;
}

export function logApiCall(entry: ApiLogEntry): void {
  if (!__DEV__) return;
  try {
    const tron = (console as Console & { tron?: ReactotronLike }).tron;
    tron?.apiResponse?.(
      {
        url: entry.url,
        method: entry.method,
        headers: redact(entry.requestHeaders),
        data: redactBody(entry.requestBody),
      },
      {
        status: entry.status,
        headers: entry.responseHeaders,
        body: entry.responseBody,
      },
      entry.duration
    );
  } catch {
    // Logging must never affect the request itself.
  }
}
