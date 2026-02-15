import { apiService } from './api';
import { 
  Client, 
  ClientSummary, 
  ClientCreateRequest, 
  ClientUpdateRequest, 
  ClientFilters,
  Project,
  Subscription,
  Invoice
} from '@/types';

class ClientService {
  private readonly baseUrl = '/clients';

  async getClients(filters?: ClientFilters): Promise<Client[]> {
    return apiService.get<Client[]>(this.baseUrl, { params: filters });
  }

  async getClient(id: string): Promise<Client> {
    return apiService.get<Client>(`${this.baseUrl}/${id}`);
  }

  async createClient(data: ClientCreateRequest): Promise<Client> {
    return apiService.post<Client>(this.baseUrl, data);
  }

  async updateClient(id: string, data: ClientUpdateRequest): Promise<Client> {
    return apiService.put<Client>(`${this.baseUrl}/${id}`, data);
  }

  async deleteClient(id: string): Promise<void> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async getClientProjects(id: string): Promise<Project[]> {
    return apiService.get<Project[]>(`${this.baseUrl}/${id}/projects`);
  }

  async getClientInvoices(id: string): Promise<Invoice[]> {
    return apiService.get<Invoice[]>(`${this.baseUrl}/${id}/invoices`);
  }

  async getClientSubscriptions(id: string): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`${this.baseUrl}/${id}/subscriptions`);
  }

  async getClientFinancialSummary(id: string): Promise<{
    totalPendingBalance: number;
    totalInvoiced: number;
    totalPaid: number;
    overdueAmount: number;
  }> {
    return apiService.get(`${this.baseUrl}/${id}/financial-summary`);
  }

  async getClientSummary(id: string): Promise<ClientSummary> {
    return apiService.get<ClientSummary>(`${this.baseUrl}/${id}/summary`);
  }
}

export const clientService = new ClientService();
