// src/services/dashboard.service.ts
import { apiService } from './api';
import { 
  DashboardSummary, 
  ExpiringItem, 
  ChartDataPoint, 
  ClientSummaryDto,
  ActivityItem 
} from '@/types';

class DashboardService {
  private readonly baseUrl = '/dashboard';

  async getSummary(): Promise<DashboardSummary> {
    return apiService.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  async getUpcomingDeadlines(): Promise<ExpiringItem[]> {
    return apiService.get<ExpiringItem[]>(`${this.baseUrl}/upcoming-deadlines`);
  }

  async getRevenueChart(period?: 'month' | 'quarter' | 'year'): Promise<ChartDataPoint[]> {
    return apiService.get<ChartDataPoint[]>(`${this.baseUrl}/revenue-chart`, { 
      params: { period } 
    });
  }

  async getPendingBalances(): Promise<ClientSummaryDto[]> {
    return apiService.get<ClientSummaryDto[]>(`${this.baseUrl}/pending-balances`);
  }

  async getExpiringItems(): Promise<ExpiringItem[]> {
    return apiService.get<ExpiringItem[]>(`${this.baseUrl}/expiring-items`);
  }

  async getRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
    return apiService.get<ActivityItem[]>(`${this.baseUrl}/recent-activity`, { 
      params: { limit } 
    });
  }
}

export const dashboardService = new DashboardService();