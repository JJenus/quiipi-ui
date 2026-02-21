// src/services/notification.service.ts
import { apiService } from './api';
import { Notification, UnreadCountResponse } from '@/types';

class NotificationService {
  private readonly baseUrl = '/notifications';

  async getUserNotifications(): Promise<Notification[]> {
    return apiService.get<Notification[]>(this.baseUrl);
  }

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiService.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`);
  }

  async markAsRead(id: string): Promise<void> {
    return apiService.patch(`${this.baseUrl}/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    return apiService.patch(`${this.baseUrl}/read-all`);
  }

  async deleteNotification(id: string): Promise<void> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }
}

export const notificationService = new NotificationService();