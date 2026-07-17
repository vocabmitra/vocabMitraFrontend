export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AppError extends Error {
  code: string;
  friendlyMessage: string;
  originalError?: any;
}
