import { apiService } from './api';
import { Subscription, Project, Invoice } from '@/types';

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
  type: 'DOMAIN' | 'HOSTING' | 'PROJECT_DEADLINE' | 'SUBSCRIPTION';
  name: string;
  relatedTo: string;
  expiryDate: string;
  daysLeft: number;
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  action: 'RENEW' | 'EXTEND' | 'COMPLETE';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

class DashboardService {
  private readonly baseUrl = '/dashboard';

  async getSummary(): Promise<DashboardSummary> {
    return apiService.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  async getExpiringItems(): Promise<ExpiringItem[]> {
    return apiService.get<ExpiringItem[]>(`${this.baseUrl}/expiring-items`);
  }

  async getRevenueChartData(period: 'month' | 'quarter' | 'year' = 'month'): Promise<ChartDataPoint[]> {
    return apiService.get<ChartDataPoint[]>(`${this.baseUrl}/revenue-chart`, { params: { period } });
  }

  async getUpcomingDeadlines(days: number = 14): Promise<Project[]> {
    return apiService.get<Project[]>(`${this.baseUrl}/upcoming-deadlines`, { params: { days } });
  }

  async getPendingBalances(): Promise<Array<{
    clientId: string;
    clientName: string;
    pendingBalance: number;
    overdueInvoices: number;
  }>> {
    return apiService.get(`${this.baseUrl}/pending-balances`);
  }

  async getRecentActivity(limit: number = 10): Promise<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    entityId: string;
    entityType: string;
  }>> {
    return apiService.get(`${this.baseUrl}/recent-activity`, { params: { limit } });
  }
}

export const dashboardService = new DashboardService();
