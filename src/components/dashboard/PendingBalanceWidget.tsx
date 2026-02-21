// src/components/dashboard/PendingBalanceWidget.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/hooks/useClients';
import { formatCurrency } from '@/utils/dateUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  ChevronRight,
  Building2,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const PendingBalanceWidget: React.FC = () => {
  const { clients = [], isLoading } = useClients();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'balance' | 'overdue'>('balance');

  const clientsWithBalance = (Array.isArray(clients) ? clients : [])
    .filter(client => (client?.pendingBalance || 0) > 0);

  const sortedClients = [...clientsWithBalance]
    .sort((a, b) => {
      if (sortBy === 'balance') {
        return (b?.pendingBalance || 0) - (a?.pendingBalance || 0);
      }
      return (b?.overdueInvoicesCount || 0) - (a?.overdueInvoicesCount || 0);
    })
    .slice(0, 5);

  const totalPending = clientsWithBalance.reduce(
    (sum, client) => sum + (client?.pendingBalance || 0), 
    0
  );

  const totalOverdue = clientsWithBalance.reduce(
    (sum, client) => sum + (client?.overdueInvoicesCount || 0), 
    0
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Balances</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {clientsWithBalance.length} clients with pending balances
            </p>
          </div>
          
          {/* Summary Badges */}
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <DollarSign className="h-3 w-3" />
              {formatCurrency(totalPending)}
            </Badge>
            {totalOverdue > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {totalOverdue} overdue
              </Badge>
            )}
          </div>
        </div>

        {/* Sort Toggle */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant={sortBy === 'balance' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSortBy('balance')}
          >
            <TrendingDown className="h-3 w-3 mr-1" />
            By Balance
          </Button>
          <Button
            variant={sortBy === 'overdue' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSortBy('overdue')}
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            By Overdue
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 w-full">
        <ScrollArea className="h-[300px] pr-4 -mr-4 w-full">
          <div className="space-y-3">
            {sortedClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-green-50 dark:bg-green-950/50 p-4 mb-4">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm font-medium">All clear!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  No pending balances from clients
                </p>
              </div>
            ) : (
              sortedClients.map((client) => {
                const overdueCount = client?.overdueInvoicesCount || 0;
                const pendingBalance = client?.pendingBalance || 0;
                const maxBalance = Math.max(...sortedClients.map(c => c?.pendingBalance || 0));
                const balancePercentage = (pendingBalance / maxBalance) * 100;

                return (
                  <div
                    key={client?.id}
                    className={cn(
                      "group relative rounded-lg border p-4 transition-all",
                      "hover:shadow-md cursor-pointer",
                      overdueCount > 0 && "border-red-200 dark:border-red-800"
                    )}
                    onClick={() => client?.id && navigate(`/clients/${client.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar/Icon */}
                      <div className={cn(
                        "rounded-full p-3 shrink-0",
                        overdueCount > 0 
                          ? "bg-red-50 dark:bg-red-950/50" 
                          : "bg-muted"
                      )}>
                        {overdueCount > 0 ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">
                              {client?.companyName || 'Unknown Client'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {client?.activeProjectsCount || 0} active projects
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>

                        {/* Balance Bar */}
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">
                              {formatCurrency(pendingBalance, client?.currency || 'USD')}
                            </span>
                            {overdueCount > 0 && (
                              <Badge variant="destructive" className="text-[10px] px-1">
                                {overdueCount} overdue
                              </Badge>
                            )}
                          </div>
                          <Progress 
                            value={balancePercentage} 
                            className={cn(
                              "h-1.5",
                              overdueCount > 0 ? "bg-red-100" : "bg-muted"
                            )}
                          />
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-3 mt-2">
                          {client?.lastInvoiceDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Last: {formatDate(client.lastInvoiceDate)}</span>
                            </div>
                          )}
                          {client?.paymentTerms && (
                            <Badge variant="outline" className="text-[10px]">
                              Net {client.paymentTerms}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer Action */}
        {sortedClients.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => navigate('/clients')}
            >
              View All Clients
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};