import { format, formatDistance, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  return format(new Date(date), formatStr);
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const getDaysUntil = (date: string | Date): number => {
  return differenceInDays(new Date(date), new Date());
};

export const isExpiringSoon = (expiryDate: string | Date, daysThreshold: number = 30): boolean => {
  const daysUntil = getDaysUntil(expiryDate);
  return daysUntil <= daysThreshold && daysUntil > 0;
};

export const isExpired = (date: string | Date): boolean => {
  return isBefore(new Date(date), new Date());
};

export const getExpiryStatus = (expiryDate: string | Date): 'healthy' | 'warning' | 'critical' | 'expired' => {
  const daysUntil = getDaysUntil(expiryDate);
  
  if (daysUntil <= 0) return 'expired';
  if (daysUntil <= 7) return 'critical';
  if (daysUntil <= 30) return 'warning';
  return 'healthy';
};

export const getDueDateStatus = (dueDate: string | Date): 'upcoming' | 'overdue' | 'completed' => {
  const now = new Date();
  const due = new Date(dueDate);
  
  if (isAfter(now, due)) return 'overdue';
  if (differenceInDays(due, now) <= 7) return 'upcoming';
  return 'completed';
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
