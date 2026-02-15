// src/pages/Dashboard.tsx
import React from 'react';
import { useDashboardSummary, useExpiringItems } from '@/hooks/useDashboard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ExpiryWidget } from '@/components/dashboard/ExpiryWidget';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { PendingBalanceWidget } from '@/components/dashboard/PendingBalanceWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const Dashboard: React.FC = () => {
  const { summary, isLoading } = useDashboardSummary();
  const { items: expiringItems, isLoading: itemsLoading } = useExpiringItems();

  if (isLoading || itemsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      <StatsCards summary={summary} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ExpiryWidget
          items={summary?.expiringSubscriptions}
          title="Expiring Subscriptions"
        />
        <ExpiryWidget
          items={summary?.expiringDomains}
          title="Expiring Domains"
        />
        <ExpiryWidget
          items={summary?.projectDeadlines}
          title="Upcoming Deadlines"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart data={summary?.revenueByMonth || []} />
        <PendingBalanceWidget />
      </div>
    </div>
  );
};