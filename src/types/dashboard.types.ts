// src/types/dashboard.types.ts
import { ClientStatus } from './client.types';

export interface DashboardSummary {
  // Financial Overview
  totalOutstandingBalance: number;
  overdueBalance: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  
  // Counts
  activeClientsCount: number;
  activeProjectsCount: number;
  pendingInvoicesCount: number;
  overdueInvoicesCount: number;
  
  // Expiring Items
  expiringSubscriptions: ExpiringItem[];
  expiringDomains: ExpiringItem[];
  projectDeadlines: ExpiringItem[];
  
  // Charts Data
  revenueByMonth: ChartDataPoint[];
  invoicesByStatus: ChartDataPoint[];
}

export interface ExpiringItem {
  id: string;
  type: 'DOMAIN' | 'HOSTING' | 'SSL' | 'PROJECT_DEADLINE' | 'SUBSCRIPTION';
  name: string;
  relatedTo: string;
  expiryDate: string;
  daysLeft: number;
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  action: 'RENEW' | 'EXTEND' | 'COMPLETE';
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ClientSummaryDto {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  status: ClientStatus;
  pendingBalance: number;
  activeProjectsCount: number;
  overdueInvoicesCount: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  entityId: string;
  entityType: string;
}