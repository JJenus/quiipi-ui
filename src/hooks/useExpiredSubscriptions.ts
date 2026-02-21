// src/hooks/useExpiredSubscriptions.ts
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { Subscription } from '@/types';

export const useExpiredSubscriptions = () => {
  const {
    data: subscriptions = [],
    isLoading,
    error
  } = useQuery<Subscription[]>({
    queryKey: ['expired-subscriptions'],
    queryFn: () => subscriptionService.getExpiredSubscriptions()
  });

  return { subscriptions, isLoading, error };
};