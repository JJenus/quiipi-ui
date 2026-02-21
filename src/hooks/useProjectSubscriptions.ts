// src/hooks/useProjectSubscriptions.ts
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { Subscription } from '@/types';

export const useProjectSubscriptions = (projectId: string) => {
  const {
    data: subscriptions = [],
    isLoading,
    error
  } = useQuery<Subscription[]>({
    queryKey: ['project-subscriptions', projectId],
    queryFn: () => projectService.getProjectSubscriptions(projectId),
    enabled: !!projectId
  });

  return { subscriptions, isLoading, error };
}; 