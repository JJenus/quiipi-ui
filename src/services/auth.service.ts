// src/services/auth.service.ts
import { apiService } from './api';
import { LoginRequest, LoginResponse, RegisterRequest, User, UserRole, AccountStatus } from '@/types';

// Mock user data
const MOCK_USER: User = {
  id: 'usr_123456789',
  email: 'demo@quiipi.com',
  firstName: 'Demo',
  lastName: 'User',
  companyName: 'Quiipi Demo',
  phone: '+1 234 567 8900',
  timezone: 'America/New_York',
  locale: 'en-US',
  role: UserRole.ADMIN,
  status: AccountStatus.ACTIVE,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString()
};

class AuthService {
  private readonly baseUrl = '/auth';
  private useMock = true; // Set to false to use real API

  async login(data: LoginRequest): Promise<LoginResponse> {
    if (this.useMock) {
      // Mock login - accept any credentials
      console.log('Mock login with:', data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response: LoginResponse = {
        accessToken: 'mock_access_token_' + Math.random().toString(36).substring(7),
        refreshToken: 'mock_refresh_token_' + Math.random().toString(36).substring(7),
        user: {
          ...MOCK_USER,
          email: data.email // Use the email from login
        }
      };
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('mockUser', JSON.stringify(response.user));
      
      return response;
    }
    
    const response = await apiService.post<LoginResponse>(`${this.baseUrl}/login`, data);
    
    // Store tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    return response;
  }

  async register(data: RegisterRequest): Promise<User> {
    if (this.useMock) {
      // Mock register
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser: User = {
        ...MOCK_USER,
        id: 'usr_' + Math.random().toString(36).substring(7),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        phone: data.phone,
        createdAt: new Date().toISOString()
      };
      
      return newUser;
    }
    
    return apiService.post<User>(`${this.baseUrl}/register`, data);
  }

  async logout(): Promise<void> {
    if (this.useMock) {
      // Mock logout
      await new Promise(resolve => setTimeout(resolve, 300));
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('mockUser');
      return;
    }
    
    try {
      await apiService.post(`${this.baseUrl}/logout`);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        accessToken: 'mock_refreshed_token_' + Math.random().toString(36).substring(7)
      };
    }
    
    const refreshToken = localStorage.getItem('refreshToken');
    return apiService.post<{ accessToken: string }>(`${this.baseUrl}/refresh-token`, { refreshToken });
  }

  async getProfile(): Promise<User> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to get from localStorage first
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      
      return MOCK_USER;
    }
    
    return apiService.get<User>('/users/profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUser = localStorage.getItem('mockUser');
      const currentUser = storedUser ? JSON.parse(storedUser) : MOCK_USER;
      const updatedUser = { ...currentUser, ...data };
      
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    }
    
    return apiService.put<User>('/users/profile', data);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Password changed (mock)');
      return;
    }
    
    return apiService.put('/users/change-password', { oldPassword, newPassword });
  }

  isAuthenticated(): boolean {
    if (this.useMock) {
      return !!localStorage.getItem('accessToken');
    }
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();