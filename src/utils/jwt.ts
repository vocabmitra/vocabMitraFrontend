/**
 * JWT client-side utility functions.
 * Safely parses and validates JWT payloads without external dependencies.
 */

export interface JwtPayload {
  id?: number | string;
  sub?: string;
  username?: string;
  email?: string;
  role?: string;
  roles?: string[] | string;
  authorities?: string[] | string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Safely parse a JWT payload without external libraries.
 * Returns null if token is malformed, not a JWT, or contains invalid JSON.
 */
export function parseJwt<T = JwtPayload>(token: string | null | undefined): T | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Check if a JWT is expired based on its 'exp' claim.
 * If token has no 'exp' claim or cannot be parsed, returns false (fails open to let server decide).
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  // Include a 5-second buffer to prevent race conditions near expiry
  return payload.exp * 1000 <= Date.now() + 5000;
}

/**
 * Extract role from JWT claims if present.
 * Inspects 'role', 'roles', and 'authorities' claims.
 */
export function getJwtRole(token: string | null | undefined): string | null {
  if (!token) return null;
  const payload = parseJwt(token);
  if (!payload) return null;

  if (typeof payload.role === 'string' && payload.role.trim() !== '') {
    return payload.role.trim();
  }
  if (Array.isArray(payload.roles) && payload.roles.length > 0) {
    return String(payload.roles[0]).trim();
  }
  if (typeof payload.roles === 'string' && payload.roles.trim() !== '') {
    return payload.roles.trim();
  }
  if (Array.isArray(payload.authorities) && payload.authorities.length > 0) {
    return String(payload.authorities[0]).trim();
  }
  if (typeof payload.authorities === 'string' && payload.authorities.trim() !== '') {
    return payload.authorities.trim();
  }

  return null;
}
