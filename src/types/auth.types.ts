export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone?: string;
  timezone: string;
  locale: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}