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
  jwt: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: RoleType;
}

export interface ProfileResponse {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  totalBookmarked: number;
  totalLearned: number;
  // currentStreak: number;  // BLOCKED — not yet in backend DTO, stub as 0 until added
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
