// src/hooks/useSettings.ts
import { useState, useCallback } from 'react';
import { settingsService } from '@/services/settings.service';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { User, UpdateProfileData, ChangePasswordData, NotificationSettings, RegionalSettings } from '@/types';

export const useSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [regionalSettings, setRegionalSettings] = useState<RegionalSettings | null>(null);
  const { addNotification } = useUIStore();
  const { setUser, user } = useAuthStore();

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setIsLoading(true);
    try {
      const updatedUser = await settingsService.updateProfile(data);
      setUser(updatedUser as User);
      addNotification({
        type: 'success',
        message: 'Profile updated successfully',
        duration: 3000,
      });
      return updatedUser;
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update profile',
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, addNotification]);

  const changePassword = useCallback(async (data: ChangePasswordData) => {
    setIsLoading(true);
    try {
      await settingsService.changePassword(data);
      addNotification({
        type: 'success',
        message: 'Password changed successfully',
        duration: 3000,
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to change password',
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const loadNotificationSettings = useCallback(async () => {
    try {
      const settings = await settingsService.getNotificationSettings();
      setNotificationSettings(settings);
      return settings;
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to load notification settings',
        duration: 5000,
      });
      throw error;
    }
  }, [addNotification]);

  const updateNotificationSettings = useCallback(async (data: NotificationSettings) => {
    setIsLoading(true);
    try {
      const updated = await settingsService.updateNotificationSettings(data);
      setNotificationSettings(updated);
      addNotification({
        type: 'success',
        message: 'Notification preferences updated',
        duration: 3000,
      });
      return updated;
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update notification settings',
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const loadRegionalSettings = useCallback(async () => {
    try {
      const settings = await settingsService.getRegionalSettings();
      setRegionalSettings(settings);
      return settings;
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to load regional settings',
        duration: 5000,
      });
      throw error;
    }
  }, [addNotification]);

  const updateRegionalSettings = useCallback(async (data: RegionalSettings) => {
    setIsLoading(true);
    try {
      const updated = await settingsService.updateRegionalSettings(data);
      setRegionalSettings(updated);
      addNotification({
        type: 'success',
        message: 'Regional settings updated',
        duration: 3000,
      });
      return updated;
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update regional settings',
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  return {
    isLoading,
    user,
    notificationSettings,
    regionalSettings,
    updateProfile,
    changePassword,
    loadNotificationSettings,
    updateNotificationSettings,
    loadRegionalSettings,
    updateRegionalSettings,
  };
};