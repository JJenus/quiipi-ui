// src/utils/dateUtils.ts - Add date formatting for API
import { format, formatDistance, differenceInDays, isAfter, isBefore, addDays, parseISO } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

export const formatDateForAPI = (date: string | Date): string => {
  if (!date) return '';
  // Format as ISO datetime with time set to start of day
  return format(new Date(date), "yyyy-MM-dd'T'00:00:00");
};

export const formatDateTimeForAPI = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toISOString();
};

export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const getDaysUntil = (date: string | Date): number => {
  if (!date) return 0;
  return differenceInDays(new Date(date), new Date());
};

export const isExpiringSoon = (expiryDate: string | Date, daysThreshold: number = 30): boolean => {
  if (!expiryDate) return false;
  const daysUntil = getDaysUntil(expiryDate);
  return daysUntil <= daysThreshold && daysUntil > 0;
};

export const isExpired = (date: string | Date): boolean => {
  if (!date) return false;
  return isBefore(new Date(date), new Date());
};

export const getExpiryStatus = (expiryDate: string | Date): 'healthy' | 'warning' | 'critical' | 'expired' => {
  if (!expiryDate) return 'healthy';
  const daysUntil = getDaysUntil(expiryDate);
  
  if (daysUntil <= 0) return 'expired';
  if (daysUntil <= 7) return 'critical';
  if (daysUntil <= 30) return 'warning';
  return 'healthy';
};

export const getDueDateStatus = (dueDate: string | Date): 'upcoming' | 'overdue' | 'completed' => {
  if (!dueDate) return 'completed';
  const now = new Date();
  const due = new Date(dueDate);
  
  if (isAfter(now, due)) return 'overdue';
  if (differenceInDays(due, now) <= 7) return 'upcoming';
  return 'completed';
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  if (amount === undefined || amount === null) return formatCurrency(0, currency);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const parseAPIDate = (dateString: string): Date => {
  return parseISO(dateString);
};