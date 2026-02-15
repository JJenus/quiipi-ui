import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardSummary, ExpiringItem } from '@/services/dashboard.service';

export const useDashboardSummary = () => {
  const {
    data: summary,
    isLoading,
    error,
    refetch
  } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardService.getSummary()
  });

  return {
    summary: summary || {
      totalOutstandingBalance: 0,
      overdueBalance: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0,
      activeClientsCount: 0,
      activeProjectsCount: 0,
      pendingInvoicesCount: 0,
      overdueInvoicesCount: 0,
      expiringSubscriptions: [],
      expiringDomains: [],
      projectDeadlines: [],
      revenueByMonth: [],
      invoicesByStatus: []
    },
    isLoading,
    error,
    refetch
  };
};

export const useExpiringItems = () => {
  const {
    data: items = [],
    isLoading,
    error
  } = useQuery<ExpiringItem[]>({
    queryKey: ['expiring-items'],
    queryFn: () => dashboardService.getExpiringItems()
  });

  return { items, isLoading, error };
};

export const useRevenueChart = (period: 'month' | 'quarter' | 'year' = 'month') => {
  const {
    data: chartData = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['revenue-chart', period],
    queryFn: () => dashboardService.getRevenueChartData(period)
  });

  return { chartData, isLoading, error };
};
