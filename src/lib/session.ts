const SESSION_STORAGE_KEY = 'np_session_id';

/**
 * Generate a v4-compliant UUID
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a persistent client-side session ID stored in localStorage.
 * Client-safe: returns empty string if executed on the server.
 */
export function getClientSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = generateUUID();
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return generateUUID();
  }
}

/**
 * Extract sessionId from a server request (via query param, header, cookie, or provided body).
 */
export function resolveServerSessionId(request: Request, bodySessionId?: string | null): string | null {
  if (bodySessionId && typeof bodySessionId === 'string' && bodySessionId.trim().length > 0) {
    return bodySessionId.trim();
  }

  // Check header
  const headerSessionId = request.headers.get('x-session-id');
  if (headerSessionId && headerSessionId.trim().length > 0) {
    return headerSessionId.trim();
  }

  // Check cookies
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_STORAGE_KEY}=([^;]*)`));
  if (match && match[1]) {
    return decodeURIComponent(match[1]).trim();
  }

  // Check URL search params
  const url = new URL(request.url);
  const querySessionId = url.searchParams.get('sessionId');
  if (querySessionId && querySessionId.trim().length > 0) {
    return querySessionId.trim();
  }

  return null;
}
