// src/hooks/useClientFinancialSummary.ts
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/client.service';
import { ClientFinancialSummary } from '@/types';

export const useClientFinancialSummary = (clientId: string) => {
  const {
    data: summary,
    isLoading,
    error
  } = useQuery<ClientFinancialSummary>({
    queryKey: ['client-financial-summary', clientId],
    queryFn: () => clientService.getClientFinancialSummary(clientId),
    enabled: !!clientId
  });

  return {
    summary: summary || {
      totalInvoiced: 0,
      totalPaid: 0,
      pendingBalance: 0,
      recentInvoices: [],
      recentPayments: []
    },
    isLoading,
    error
  };
};