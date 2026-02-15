import { apiService } from './api';
import { 
  Subscription, 
  SubscriptionSummary,
  SubscriptionCreateRequest, 
  SubscriptionUpdateRequest,
  SubscriptionRenewalRequest,
  SubscriptionFilters,
  SubscriptionType,
  SubscriptionStatus
} from '@/types';

class SubscriptionService {
  private readonly baseUrl = '/subscriptions';

  async getSubscriptions(filters?: SubscriptionFilters): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(this.baseUrl, { params: filters });
  }

  async getSubscription(id: string): Promise<Subscription> {
    return apiService.get<Subscription>(`${this.baseUrl}/${id}`);
  }

  async createSubscription(data: SubscriptionCreateRequest): Promise<Subscription> {
    return apiService.post<Subscription>(this.baseUrl, data);
  }

  async updateSubscription(id: string, data: SubscriptionUpdateRequest): Promise<Subscription> {
    return apiService.put<Subscription>(`${this.baseUrl}/${id}`, data);
  }

  async deleteSubscription(id: string): Promise<void> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async renewSubscription(id: string, data: SubscriptionRenewalRequest): Promise<Subscription> {
    return apiService.post<Subscription>(`${this.baseUrl}/${id}/renew`, data);
  }

  async getExpiringSubscriptions(days: number = 30): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`${this.baseUrl}/expiring`, { params: { days } });
  }

  async getExpiredSubscriptions(): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`${this.baseUrl}/expired`);
  }

  async getDomainSubscriptions(): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`${this.baseUrl}/domains`);
  }

  async getHostingSubscriptions(): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`${this.baseUrl}/hosting`);
  }

  async triggerExpiryNotification(id: string): Promise<void> {
    return apiService.patch(`${this.baseUrl}/${id}/notify`);
  }

  async getSubscriptionSummary(id: string): Promise<SubscriptionSummary> {
    return apiService.get<SubscriptionSummary>(`${this.baseUrl}/${id}/summary`);
  }

  async getSubscriptionsByType(type: SubscriptionType): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`${this.baseUrl}/type/${type}`);
  }

  async getSubscriptionsByStatus(status: SubscriptionStatus): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`${this.baseUrl}/status/${status}`);
  }
}

export const subscriptionService = new SubscriptionService();
