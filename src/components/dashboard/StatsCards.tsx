// src/components/dashboard/StatsCards.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummary } from '@/services/dashboard.service';
import { formatCurrency } from '@/utils/dateUtils';
import { Users, FolderKanban, CreditCard, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatsCardsProps {
  summary: DashboardSummary | undefined;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ summary }) => {
  const stats = [
    {
      title: 'Total Outstanding',
      value: summary ? formatCurrency(summary.totalOutstandingBalance) : '$0.00',
      icon: CreditCard,
      description: 'Pending payments',
      trend: summary?.outstandingTrend || '+0%',
      trendUp: true,
      color: 'blue',
    },
    {
      title: 'Overdue Balance',
      value: summary ? formatCurrency(summary.overdueBalance) : '$0.00',
      icon: AlertCircle,
      description: summary ? `${summary.overdueInvoicesCount || 0} overdue invoices` : '0 overdue invoices',
      trend: summary?.overdueTrend || '0%',
      trendUp: false,
      color: 'red',
      highlight: (summary?.overdueInvoicesCount || 0) > 0,
    },
    {
      title: 'Active Clients',
      value: summary ? (summary.activeClientsCount || 0).toString() : '0',
      icon: Users,
      description: 'With ongoing projects',
      trend: summary?.clientsTrend || '+0%',
      trendUp: true,
      color: 'green',
    },
    {
      title: 'Active Projects',
      value: summary ? (summary.activeProjectsCount || 0).toString() : '0',
      icon: FolderKanban,
      description: 'In progress',
      trend: summary?.projectsTrend || '0%',
      trendUp: true,
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-500',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/50',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-500',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/50',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-500',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      text: 'text-purple-600 dark:text-purple-400',
      icon: 'text-purple-500',
    },
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses];
        
        return (
          <Card 
            key={index} 
            className={cn(
              "relative overflow-hidden transition-all hover:shadow-lg",
              stat.highlight && "ring-2 ring-red-200 dark:ring-red-900"
            )}
          >
            {/* Background Pattern */}
            <div className={cn("absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full opacity-10", colors.bg)} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", colors.bg)}>
                <stat.icon className={cn("h-4 w-4", colors.icon)} />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className={cn("text-2xl font-bold", colors.text)}>
                    {stat.value}
                  </div>
                  
                  {/* Trend Indicator */}
                  {stat.trend && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "ml-2",
                        stat.trendUp 
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                          : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                      )}
                    >
                      <TrendingUp className={cn("mr-1 h-3 w-3", !stat.trendUp && "rotate-180")} />
                      {stat.trend}
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>

                {/* Progress Bar (example for visual interest) */}
                {stat.color === 'blue' && (
                  <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: '65%' }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};