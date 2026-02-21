import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { useUIStore } from '@/store/uiStore';
import { ProjectCreateRequest, ProjectUpdateRequest, MilestoneCreateRequest, ProjectStatus, Project, Invoice, Subscription, ProjectMilestone } from '@/types';

export const useProjects = (filters?: {
  status?: ProjectStatus;
  clientId?: string;
}) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const {
    data: projects = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectService.getProjects(filters)
  });

  const createProject = useMutation({
    mutationFn: (data: ProjectCreateRequest) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      addNotification({
        type: 'success',
        message: 'Project created successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create project',
        duration: 5000
      });
    }
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdateRequest }) =>
      projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      addNotification({
        type: 'success',
        message: 'Project updated successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update project',
        duration: 5000
      });
    }
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      addNotification({
        type: 'success',
        message: 'Project deleted successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete project',
        duration: 5000
      });
    }
  });

  const updateProjectStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      projectService.updateProjectStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      addNotification({
        type: 'success',
        message: 'Project status updated successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update project status',
        duration: 5000
      });
    }
  });

  return {
    projects,
    isLoading,
    error,
    refetch,
    createProject: createProject.mutate,
    updateProject: updateProject.mutate,
    deleteProject: deleteProject.mutate,
    updateProjectStatus: updateProjectStatus.mutate,
    isCreating: createProject.isPending,
    isUpdating: updateProject.isPending,
    isDeleting: deleteProject.isPending
  };
};

export const useProjectMilestonesI = (projectId: string) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const {
    data: milestones = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => projectService.getProjectMilestones(projectId),
    enabled: !!projectId
  });

  const addMilestone = useMutation({
    mutationFn: (data: MilestoneCreateRequest) =>
      projectService.addProjectMilestone(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
      addNotification({
        type: 'success',
        message: 'Milestone added successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to add milestone',
        duration: 5000
      });
    }
  });

  return {
    milestones,
    isLoading,
    error,
    addMilestone: addMilestone.mutate,
    isAdding: addMilestone.isPending
  };
};


export const useProject = (id: string) => {
  const {
    data: project,
    isLoading,
    error
  } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(id),
    enabled: !!id
  });

  return { project, isLoading, error };
};

export const useProjectInvoicesI = (projectId: string) => {
  const {
    data: invoices = [],
    isLoading,
    error
  } = useQuery<Invoice[]>({
    queryKey: ['project-invoices', projectId],
    queryFn: () => projectService.getProjectInvoices(projectId),
    enabled: !!projectId
  });

  return { invoices, isLoading, error };
};

// src/hooks/useProjects.ts - Add these hooks
export const useProjectInvoices = (projectId: string) => {
  const {
    data: invoices = [],
    isLoading,
    error
  } = useQuery<Invoice[]>({
    queryKey: ['project-invoices', projectId],
    queryFn: () => projectService.getProjectInvoices(projectId),
    enabled: !!projectId
  });

  return { invoices, isLoading, error };
};

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

export const useProjectMilestones = (projectId: string) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const {
    data: milestones = [],
    isLoading,
    error,
    refetch
  } = useQuery<ProjectMilestone[]>({
    queryKey: ['project-milestones', projectId],
    queryFn: () => projectService.getProjectMilestones(projectId),
    enabled: !!projectId
  });

  const addMilestone = useMutation({
    mutationFn: (data: MilestoneCreateRequest) =>
      projectService.addProjectMilestone(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones', projectId] });
      addNotification({
        type: 'success',
        message: 'Milestone added successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to add milestone',
        duration: 5000
      });
    }
  });

  const updateMilestone = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectMilestone> }) =>
      projectService.updateMilestone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones', projectId] });
      addNotification({
        type: 'success',
        message: 'Milestone updated successfully',
        duration: 3000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update milestone',
        duration: 5000
      });
    }
  });

  return {
    milestones,
    isLoading,
    error,
    refetch,
    addMilestone: addMilestone.mutate,
    updateMilestone: updateMilestone.mutate,
    isAdding: addMilestone.isPending,
    isUpdating: updateMilestone.isPending
  };
};