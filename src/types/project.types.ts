import { BaseEntity } from './common.types';
import { ClientSummary } from './client.types';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED'
}

export interface Project extends BaseEntity {
  name: string;
  description?: string;
  client: ClientSummary;
  startDate: string;
  deadline: string;
  completedDate?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  estimatedBudget: number;
  actualCost: number;
  hourlyRate: number;
  pendingBalance: number;
  repositoryUrl?: string;
  stagingUrl?: string;
  productionUrl?: string;
  daysUntilDeadline: number;
  isDeadlineNear: boolean;
}

export interface ProjectSummary {
  id: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline: string;
  pendingBalance: number;
}

export interface ProjectMilestone extends BaseEntity {
  projectId: string;
  name: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  status: MilestoneStatus;
  paymentAmount?: number;
  invoiceGenerated: boolean;
  invoiceId?: string;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  clientId: string;
  startDate?: string;
  deadline?: string;
  priority?: ProjectPriority;
  estimatedBudget?: number;
  hourlyRate?: number;
  repositoryUrl?: string;
  stagingUrl?: string;
  productionUrl?: string;
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  startDate?: string;
  deadline?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  estimatedBudget?: number;
  actualCost?: number;
  repositoryUrl?: string;
  stagingUrl?: string;
  productionUrl?: string;
}

export interface MilestoneCreateRequest {
  name: string;
  description?: string;
  dueDate: string;
  paymentAmount?: number;
}
