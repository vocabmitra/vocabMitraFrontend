import { AppError } from '@/types';
import { ERROR_MESSAGES } from './errorMessages';

export function normalizeError(error: any): AppError {
  console.error('[Error Details]:', error);

  const code = error?.response?.data?.error?.code || error?.code || 'DEFAULT';
  const friendlyMessage = ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;

  const appError = new Error(friendlyMessage) as AppError;
  appError.code = code;
  appError.friendlyMessage = friendlyMessage;
  appError.originalError = error;

  return appError;
}
