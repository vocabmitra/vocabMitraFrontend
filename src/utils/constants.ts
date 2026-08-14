// Application-wide constants

/** API base URL — set VITE_API_BASE_URL in .env to override */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

/** Default page size for vocab list pagination */
export const DEFAULT_PAGE_SIZE = 9;

/** localStorage key for auth token */
export const AUTH_TOKEN_KEY = 'vv-auth-token';

/** localStorage key for auth user */
export const AUTH_USER_KEY = 'vv-auth-user';

/** App name */
export const APP_NAME = 'Vocab Mitra';
