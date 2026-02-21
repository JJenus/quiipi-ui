// src/hooks/useSubscriptions.ts - Add the missing useSubscription hook
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { useUIStore } from '@/store/uiStore';
import { SubscriptionCreateRequest, SubscriptionUpdateRequest, SubscriptionRenewalRequest, SubscriptionFilters, Subscription } from '@/types';

export const useSubscriptions = (filters?: SubscriptionFilters) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const {
    data: subscriptions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['subscriptions', filters],
    queryFn: () => subscriptionService.getSubscriptions(filters)
  });

  const createSubscription = useMutation({
    mutationFn: (data: SubscriptionCreateRequest) => subscriptionService.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      addNotification({
        type: 'success',
        message: 'Subscription created successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create subscription',
        duration: 5000
      });
    }
  });

  const updateSubscription = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionUpdateRequest }) =>
      subscriptionService.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      addNotification({
        type: 'success',
        message: 'Subscription updated successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update subscription',
        duration: 5000
      });
    }
  });

  const deleteSubscription = useMutation({
    mutationFn: (id: string) => subscriptionService.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      addNotification({
        type: 'success',
        message: 'Subscription deleted successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete subscription',
        duration: 5000
      });
    }
  });

  const renewSubscription = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionRenewalRequest }) =>
      subscriptionService.renewSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      addNotification({
        type: 'success',
        message: 'Subscription renewed successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to renew subscription',
        duration: 5000
      });
    }
  });

  return {
    subscriptions,
    isLoading,
    error,
    refetch,
    createSubscription: createSubscription.mutate,
    updateSubscription: updateSubscription.mutate,
    deleteSubscription: deleteSubscription.mutate,
    renewSubscription: renewSubscription.mutate,
    isCreating: createSubscription.isPending,
    isUpdating: updateSubscription.isPending,
    isDeleting: deleteSubscription.isPending,
    isRenewing: renewSubscription.isPending
  };
};


export const useSubscription = (id: string) => {
  const {
    data: subscription,
    isLoading,
    error
  } = useQuery<Subscription>({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionService.getSubscription(id),
    enabled: !!id
  });

  return { subscription, isLoading, error };
};

export const useExpiringSubscriptions = (days: number = 30) => {
  const {
    data: subscriptions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['expiring-subscriptions', days],
    queryFn: () => subscriptionService.getExpiringSubscriptions(days)
  });

  return { subscriptions, isLoading, error };
};

export const useExpiredSubscriptions = () => {
  const {
    data: subscriptions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['expired-subscriptions'],
    queryFn: () => subscriptionService.getExpiredSubscriptions()
  });

  return { subscriptions, isLoading, error };
};