// src/services/billing.service.ts
import { apiService } from './api';
import { 
  BankAccount, 
  PaymentLink, 
  BillingSettings,
  CreateBankAccountRequest,
  CreatePaymentLinkRequest 
} from '@/types';

class BillingService {
  private readonly baseUrl = '/billing';

  async getBillingSettings(): Promise<BillingSettings> {
    return apiService.get<BillingSettings>(`${this.baseUrl}/settings`);
  }

  async createBankAccount(data: CreateBankAccountRequest): Promise<BankAccount> {
    return apiService.post<BankAccount>(`${this.baseUrl}/bank-accounts`, data);
  }

  async updateBankAccount(id: string, data: Partial<BankAccount>): Promise<BankAccount> {
    return apiService.put<BankAccount>(`${this.baseUrl}/bank-accounts/${id}`, data);
  }

  async deleteBankAccount(id: string): Promise<void> {
    return apiService.delete(`${this.baseUrl}/bank-accounts/${id}`);
  }

  async createPaymentLink(data: CreatePaymentLinkRequest): Promise<PaymentLink> {
    return apiService.post<PaymentLink>(`${this.baseUrl}/payment-links`, data);
  }

  async updatePaymentLink(id: string, data: Partial<PaymentLink>): Promise<PaymentLink> {
    return apiService.put<PaymentLink>(`${this.baseUrl}/payment-links/${id}`, data);
  }

  async deletePaymentLink(id: string): Promise<void> {
    return apiService.delete(`${this.baseUrl}/payment-links/${id}`);
  }

  async setDefaultPaymentMethod(method: 'BANK' | 'PAYMENT_LINK'): Promise<void> {
    return apiService.put(`${this.baseUrl}/default-payment-method`, { method });
  }

  async updatePaymentInstructions(instructions: string): Promise<void> {
    return apiService.put(`${this.baseUrl}/payment-instructions`, { instructions });
  }
}

export const billingService = new BillingService();