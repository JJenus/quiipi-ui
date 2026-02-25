// src/services/settings.service.ts
import { apiService } from './api';
import { 
  User, 
  UpdateProfileData, 
  ChangePasswordData, 
  NotificationSettings, 
  RegionalSettings 
} from '@/types';

class SettingsService {
  private useMock = true; // Set to false to use real API

  async updateProfile(data: UpdateProfileData): Promise<User> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get current user from localStorage or create mock
      const storedUser = localStorage.getItem('mockUser');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      const updatedUser = { ...currentUser, ...data };
      
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    }
    
    return apiService.put<User>('/users/profile', data);
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Password changed (mock)');
      return;
    }
    
    return apiService.put('/users/change-password', data);
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to get from localStorage
      const stored = localStorage.getItem('notificationSettings');
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Default settings
      return {
        emailNotifications: true,
        subscriptionExpiryAlerts: true,
        projectDeadlineReminders: true,
        invoiceOverdueAlerts: true,
        paymentReceived: true,
        invoiceCreated: false,
        projectUpdates: false,
        marketingEmails: false,
      };
    }
    
    return apiService.get<NotificationSettings>('/users/notification-settings');
  }

  async updateNotificationSettings(data: NotificationSettings): Promise<NotificationSettings> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('notificationSettings', JSON.stringify(data));
      return data;
    }
    
    return apiService.put<NotificationSettings>('/users/notification-settings', data);
  }

  async getRegionalSettings(): Promise<RegionalSettings> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to get from localStorage
      const stored = localStorage.getItem('regionalSettings');
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Default settings
      return {
        language: 'en',
        timezone: 'America/New_York',
        currency: 'USD',
      };
    }
    
    return apiService.get<RegionalSettings>('/users/regional-settings');
  }

  async updateRegionalSettings(data: RegionalSettings): Promise<RegionalSettings> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('regionalSettings', JSON.stringify(data));
      return data;
    }
    
    return apiService.put<RegionalSettings>('/users/regional-settings', data);
  }
}

export const settingsService = new SettingsService();