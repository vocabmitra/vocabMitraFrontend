// Application-wide constants

/** API base URL — set VITE_API_BASE_URL in .env to override */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

/** API Request Timeout in milliseconds — set VITE_API_TIMEOUT in .env to override */
export const API_TIMEOUT =
  Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

/** Enable Mock Data fallback mode — set VITE_ENABLE_MOCK_DATA in .env to override */
export const ENABLE_MOCK_DATA =
  import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

/** Default page size for vocab list pagination */
export const DEFAULT_PAGE_SIZE = 9;

/** localStorage key for auth token */
export const AUTH_TOKEN_KEY = 'vv-auth-token';

/** localStorage key for auth user */
export const AUTH_USER_KEY = 'vv-auth-user';

/** App name — set VITE_APP_NAME in .env to override */
export const APP_NAME =
  import.meta.env.VITE_APP_NAME ?? 'Vocab Mitra';
