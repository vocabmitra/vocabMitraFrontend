export const ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  AUTH_INVALID_CREDENTIALS: "That email or password doesn't match our records.",
  AUTH_EMAIL_TAKEN: 'An account with this email already exists.',
  AUTH_USERNAME_TAKEN: 'That username is already taken.',
  AUTH_UNAUTHORIZED: 'You need to log in to do that.',
  AUTH_FORBIDDEN: "You don't have permission to perform this action.",

  // Vocab errors
  VOCAB_NOT_FOUND: "That word doesn't seem to exist anymore.",

  // Network / server errors
  NETWORK_ERROR: "Can't reach the server. Check your connection and try again.",
  SERVER_ERROR: 'Something went wrong on our end. Please try again.',

  // Fallback
  DEFAULT: 'Something went wrong on our end. Please try again.',
};
