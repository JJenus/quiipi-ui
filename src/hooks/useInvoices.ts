import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '@/services/invoice.service';
import { useUIStore } from '@/store/uiStore';
import { InvoiceCreateRequest, InvoiceUpdateRequest, InvoicePaymentRequest, InvoiceFilters } from '@/types';

export const useInvoices = (filters?: InvoiceFilters) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const {
    data: invoices = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoiceService.getInvoices(filters)
  });

  const createInvoice = useMutation({
    mutationFn: (data: InvoiceCreateRequest) => invoiceService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addNotification({
        type: 'success',
        message: 'Invoice created successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create invoice',
        duration: 5000
      });
    }
  });

  const updateInvoice = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InvoiceUpdateRequest }) =>
      invoiceService.updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addNotification({
        type: 'success',
        message: 'Invoice updated successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update invoice',
        duration: 5000
      });
    }
  });

  const deleteInvoice = useMutation({
    mutationFn: (id: string) => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addNotification({
        type: 'success',
        message: 'Invoice deleted successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete invoice',
        duration: 5000
      });
    }
  });

  const addPayment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InvoicePaymentRequest }) =>
      invoiceService.addPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addNotification({
        type: 'success',
        message: 'Payment added successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to add payment',
        duration: 5000
      });
    }
  });

  const sendInvoice = useMutation({
    mutationFn: (id: string) => invoiceService.sendInvoice(id),
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Invoice sent successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to send invoice',
        duration: 5000
      });
    }
  });

  return {
    invoices,
    isLoading,
    error,
    refetch,
    createInvoice: createInvoice.mutate,
    updateInvoice: updateInvoice.mutate,
    deleteInvoice: deleteInvoice.mutate,
    addPayment: addPayment.mutate,
    sendInvoice: sendInvoice.mutate,
    isCreating: createInvoice.isPending,
    isUpdating: updateInvoice.isPending,
    isDeleting: deleteInvoice.isPending,
    isAddingPayment: addPayment.isPending
  };
};

export const useOverdueInvoices = () => {
  const {
    data: invoices = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['overdue-invoices'],
    queryFn: () => invoiceService.getOverdueInvoices()
  });

  return { invoices, isLoading, error };
};

export const useInvoice = (id: string) => {
  const {
    data: invoice,
    isLoading,
    error
  } = useQuery<Invoice>({
    queryKey: ['project', id],
    queryFn: () => invoiceService.getInvoice(id),
    enabled: !!id
  });

  return { invoice, isLoading, error };
};
