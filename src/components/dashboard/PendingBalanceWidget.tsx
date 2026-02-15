// src/components/dashboard/PendingBalanceWidget.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/hooks/useClients';
import { formatCurrency } from '@/utils/dateUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export const PendingBalanceWidget: React.FC = () => {
  const { clients = [], isLoading } = useClients();
  const navigate = useNavigate();
  console.log(clients)

  const clientsWithBalance = (Array.isArray(clients) ? clients : [])
    .filter(client => (client?.pendingBalance || 0) > 0)
    .sort((a, b) => (b?.pendingBalance || 0) - (a?.pendingBalance || 0))
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {!clientsWithBalance || clientsWithBalance.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending balances
              </p>
            ) : (
              clientsWithBalance.map((client) => (
                <div
                  key={client?.id || Math.random()}
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => client?.id && navigate(`/clients/${client.id}`)}
                >
                  <div>
                    <p className="font-medium">{client?.companyName || 'Unknown Client'}</p>
                    <p className="text-xs text-muted-foreground">
                      {client?.activeProjectsCount || 0} active projects
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(client?.pendingBalance || 0, client?.currency || 'USD')}
                    </p>
                    {(client?.overdueInvoicesCount || 0) > 0 && (
                      <Badge variant="destructive" className="mt-1">
                        {client?.overdueInvoicesCount || 0} overdue
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};