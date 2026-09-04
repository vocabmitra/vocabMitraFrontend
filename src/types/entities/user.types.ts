// user.types.ts
// Do NOT rename fields — these mirror confirmed backend DTOs.

export type RoleType = 'USER' | 'ADMIN' | 'SUBSCRIBED_USER'; // OPEN — placeholder

export interface SignupRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  // password field intentionally excluded — confirmed removed from backend contract
  createdAt: string;
  role: RoleType;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  jwt?: string;
  token?: string;
  accessToken?: string;
  userId?: string | number;
  id?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  role?: RoleType;
  user?: AuthUser;
}

export interface ProfileResponse {
  firstName: string;
  lastName: string;
  username: string;
  email: string;

  // Lightweight statistics
  totalBookmarked: number;
  totalLearned: number;

  // Daily Streak fields
  currentStreak: number;
  maxStreak: number;
  isStreakActiveToday: boolean;
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: RoleType;
  createdAt: string;
}

/**
 * Robustly extract JWT token and AuthUser from any backend response shape
 */
export function extractAuthPayload(res: any, fallbackUsername: string = 'User'): { token: string; user: AuthUser } {
  const rawData = res?.data ?? res;

  // Extract JWT Token
  const token: string = String(
    rawData?.jwt ||
    rawData?.token ||
    rawData?.accessToken ||
    rawData?.bearerToken ||
    ''
  ).trim();

  // Extract AuthUser object
  let user: AuthUser;
  if (rawData?.user && typeof rawData.user === 'object') {
    user = {
      id: Number(rawData.user.id ?? rawData.user.userId ?? rawData.userId ?? 1),
      username: rawData.user.username || rawData.username || fallbackUsername,
      email: rawData.user.email || rawData.email || `${fallbackUsername}@vocabmitra.com`,
      firstName: rawData.user.firstName || rawData.user.name || rawData.firstName || fallbackUsername,
      lastName: rawData.user.lastName || rawData.lastName || '',
      role: (rawData.user.role || rawData.role || 'USER') as RoleType,
      createdAt: rawData.user.createdAt || rawData.createdAt || new Date().toISOString(),
    };
  } else {
    const rawId = rawData?.userId ?? rawData?.id ?? 1;
    user = {
      id: Number(rawId),
      username: rawData?.username || fallbackUsername,
      email: rawData?.email || `${fallbackUsername}@vocabmitra.com`,
      firstName: rawData?.firstName || rawData?.name || fallbackUsername,
      lastName: rawData?.lastName || '',
      role: (rawData?.role || 'USER') as RoleType,
      createdAt: rawData?.createdAt || new Date().toISOString(),
    };
  }

  return { token, user };
}

export function toAuthUser(res: SignupResponse): AuthUser {
  return {
    id: res.id,
    firstName: res.firstName,
    lastName: res.lastName,
    username: res.username,
    email: res.email,
    role: res.role,
    createdAt: res.createdAt,
  };
}
