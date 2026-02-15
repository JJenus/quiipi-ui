// src/components/dashboard/StatsCards.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummary } from '@/services/dashboard.service';
import { formatCurrency } from '@/utils/dateUtils';
import { Users, FolderKanban, CreditCard, AlertCircle } from 'lucide-react';

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
    },
    {
      title: 'Overdue Balance',
      value: summary ? formatCurrency(summary.overdueBalance) : '$0.00',
      icon: AlertCircle,
      description: summary ? `${summary.overdueInvoicesCount || 0} overdue invoices` : '0 overdue invoices',
      className: 'text-red-600',
    },
    {
      title: 'Active Clients',
      value: summary ? (summary.activeClientsCount || 0).toString() : '0',
      icon: Users,
      description: 'With ongoing projects',
    },
    {
      title: 'Active Projects',
      value: summary ? (summary.activeProjectsCount || 0).toString() : '0',
      icon: FolderKanban,
      description: 'In progress',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.className || ''}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold truncate ${stat.className || ''}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground truncate">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};