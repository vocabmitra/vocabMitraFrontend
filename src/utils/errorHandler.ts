import axios from 'axios';
import { ERROR_MESSAGES } from './errorMessages';
import { logger } from './logger';

export interface AppError {
  message: string;
  code?: string;
}

/**
 * Normalize any thrown error into a safe AppError.
 * - Logs raw backend payload to console for debugging in DEV only
 * - Returns ONLY a friendly user-facing message
 * - Components MUST NEVER receive or render error.response.data.error.message directly
 */
export function normalizeError(error: unknown): AppError {
  // Network error (no response received)
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      logger.error('[API Network Error]', error.message);
      return { message: ERROR_MESSAGES.NETWORK_ERROR, code: 'NETWORK_ERROR' };
    }

    // Server returned an error response
    const status = error.response.status;
    const payload = error.response.data;

    // Log raw payload for debugging — never shown to user or leaked in production
    logger.error(`[API Error ${status}]`, payload);

    // Try to extract backend error code from confirmed envelope
    const backendCode: string | undefined =
      payload?.error?.code ?? payload?.code ?? undefined;

    if (backendCode && ERROR_MESSAGES[backendCode]) {
      return { message: ERROR_MESSAGES[backendCode], code: backendCode };
    }

    // HTTP status fallbacks
    if (status === 401) return { message: ERROR_MESSAGES.AUTH_UNAUTHORIZED, code: 'AUTH_UNAUTHORIZED' };
    if (status === 403) return { message: ERROR_MESSAGES.AUTH_FORBIDDEN, code: 'AUTH_FORBIDDEN' };
    if (status === 404) return { message: ERROR_MESSAGES.VOCAB_NOT_FOUND, code: 'VOCAB_NOT_FOUND' };
    if (status >= 500) return { message: ERROR_MESSAGES.SERVER_ERROR, code: 'SERVER_ERROR' };

    return { message: ERROR_MESSAGES.DEFAULT, code: 'DEFAULT' };
  }

  // Non-Axios errors
  logger.error('[Unexpected Error]', error);
  return { message: ERROR_MESSAGES.DEFAULT, code: 'DEFAULT' };
}
