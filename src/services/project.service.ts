// src/services/project.service.ts - Add missing methods
import { apiService } from './api';
import { 
  Project, 
  ProjectSummary, 
  ProjectCreateRequest, 
  ProjectUpdateRequest,
  ProjectMilestone,
  MilestoneCreateRequest,
  Subscription,
  Invoice,
  ProjectStatus
} from '@/types';

class ProjectService {
  private readonly baseUrl = '/projects';

  async getProjects(filters?: {
    status?: ProjectStatus;
    clientId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<Project[]> {
    return apiService.get<Project[]>(this.baseUrl, { params: filters });
  }

  async getProject(id: string): Promise<Project> {
    return apiService.get<Project>(`${this.baseUrl}/${id}`);
  }

  async createProject(data: ProjectCreateRequest): Promise<Project> {
    return apiService.post<Project>(this.baseUrl, data);
  }

  async updateProject(id: string, data: ProjectUpdateRequest): Promise<Project> {
    return apiService.put<Project>(`${this.baseUrl}/${id}`, data);
  }

  async deleteProject(id: string): Promise<void> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<Project> {
    return apiService.patch<Project>(`${this.baseUrl}/${id}/status`, { status });
  }

  async getProjectSubscriptions(id: string): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`${this.baseUrl}/${id}/subscriptions`);
  }

  async getProjectInvoices(id: string): Promise<Invoice[]> {
    return apiService.get<Invoice[]>(`${this.baseUrl}/${id}/invoices`);
  }

  async getProjectMilestones(id: string): Promise<ProjectMilestone[]> {
    return apiService.get<ProjectMilestone[]>(`${this.baseUrl}/${id}/milestones`);
  }

  async addProjectMilestone(id: string, data: MilestoneCreateRequest): Promise<ProjectMilestone> {
    return apiService.post<ProjectMilestone>(`${this.baseUrl}/${id}/milestones`, data);
  }

  async updateMilestone(milestoneId: string, data: Partial<ProjectMilestone>): Promise<ProjectMilestone> {
    return apiService.put<ProjectMilestone>(`${this.baseUrl}/milestones/${milestoneId}`, data);
  }

  async getUpcomingDeadlines(days: number = 7): Promise<Project[]> {
    return apiService.get<Project[]>(`${this.baseUrl}/upcoming-deadlines`, { params: { days } });
  }

  async getProjectSummary(id: string): Promise<ProjectSummary> {
    return apiService.get<ProjectSummary>(`${this.baseUrl}/${id}/summary`);
  }
}

export const projectService = new ProjectService();