// src/types/notification.types.ts
export interface Notification {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  type: 'SUBSCRIPTION_EXPIRY' | 'PROJECT_DEADLINE' | 'INVOICE_OVERDUE';
  title: string;
  message: string;
  relatedEntityId: string;
  relatedEntityType: string;
  readAt?: string;
  read: boolean;
  emailSent: boolean;
}
 
export interface UnreadCountResponse {
  count: number;
}