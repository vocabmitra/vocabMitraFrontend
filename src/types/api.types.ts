// api.types.ts
// OPEN — confirm exact response envelope shape with backend before Phase 3 wiring.
// The shape below is a reasonable default, not yet confirmed.

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
}

export interface ApiErrorPayload {
  code: string;
  message: string; // raw backend message — never render this directly; see errorHandler.ts
}

// Pagination envelope (Spring Data Page response matching /vocabs/public/all)
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed from Spring)
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
  pageable?: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
}
