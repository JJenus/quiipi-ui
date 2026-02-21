// src/hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/client.service';
import { useUIStore } from '@/store/uiStore';
import { ClientCreateRequest, ClientUpdateRequest, ClientFilters, Invoice } from '@/types';

export const useClients = (filters?: ClientFilters) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const {
    data: clients = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientService.getClients(filters)
  });

  const createClient = useMutation({
    mutationFn: (data: ClientCreateRequest) => clientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      addNotification({
        type: 'success',
        message: 'Client created successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create client',
        duration: 5000
      });
    }
  });

  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientUpdateRequest }) =>
      clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      addNotification({
        type: 'success',
        message: 'Client updated successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update client',
        duration: 5000
      });
    }
  });

  const deleteClient = useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      addNotification({
        type: 'success',
        message: 'Client deleted successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete client',
        duration: 5000
      });
    }
  });

  return {
    clients,
    isLoading,
    error,
    refetch,
    createClient: createClient.mutate,
    updateClient: updateClient.mutate,
    deleteClient: deleteClient.mutate,
    isCreating: createClient.isPending,
    isUpdating: updateClient.isPending,
    isDeleting: deleteClient.isPending
  };
};

export const useClient = (id: string) => {
  const {
    data: client,
    isLoading,
    error
  } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(id),
    enabled: !!id
  });

  return { client, isLoading, error };
};

// export const useClientInvoices = (id: string) => {
//   const {
//     data: invoices = [],
//     isLoading,
//     error
//   } = useQuery<Invoice[]>({
//     queryKey: ['client-invoices', id],
//     queryFn: () => clientService.getClientInvoices(id),
//     enabled: !!id
//   });

//   return { invoices, isLoading, error };
// };

// src/hooks/useClients.ts - Add these hooks if they don't exist
export const useClientProjects = (clientId: string) => {
  const {
    data: projects = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['client-projects', clientId],
    queryFn: () => clientService.getClientProjects(clientId),
    enabled: !!clientId
  });

  return { projects, isLoading, error };
};

export const useClientInvoices = (clientId: string) => {
  const {
    data: invoices = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['client-invoices', clientId],
    queryFn: () => clientService.getClientInvoices(clientId),
    enabled: !!clientId
  });

  return { invoices, isLoading, error };
};

export const useClientSubscriptions = (clientId: string) => {
  const {
    data: subscriptions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['client-subscriptions', clientId],
    queryFn: () => clientService.getClientSubscriptions(clientId),
    enabled: !!clientId
  });

  return { subscriptions, isLoading, error };
};