// src/services/invoice.service.ts - Add missing methods
import { apiService } from './api';
import { 
  Invoice, 
  InvoiceCreateRequest, 
  InvoiceUpdateRequest,
  InvoicePaymentRequest,
  InvoiceFilters,
  Payment,
  InvoiceStatus
} from '@/types';

class InvoiceService {
  private readonly baseUrl = '/invoices';

  async getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    return apiService.get<Invoice[]>(this.baseUrl, { params: filters });
  }

  async getInvoice(id: string): Promise<Invoice> {
    return apiService.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  async createInvoice(data: InvoiceCreateRequest): Promise<Invoice> {
    return apiService.post<Invoice>(this.baseUrl, data);
  }

  async updateInvoice(id: string, data: InvoiceUpdateRequest): Promise<Invoice> {
    return apiService.put<Invoice>(`${this.baseUrl}/${id}`, data);
  }

  async deleteInvoice(id: string): Promise<void> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async sendInvoice(id: string): Promise<void> {
    return apiService.post(`${this.baseUrl}/${id}/send`);
  }

  async addPayment(id: string, data: InvoicePaymentRequest): Promise<Payment> {
    return apiService.post<Payment>(`${this.baseUrl}/${id}/payments`, data);
  }

  async getPayments(id: string): Promise<Payment[]> {
    return apiService.get<Payment[]>(`${this.baseUrl}/${id}/payments`);
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    return apiService.get<Invoice[]>(`${this.baseUrl}/overdue`);
  }

  async getPendingInvoices(): Promise<Invoice[]> {
    return apiService.get<Invoice[]>(`${this.baseUrl}/pending`);
  }

  async generateInvoiceNumber(): Promise<{ invoiceNumber: string }> {
    return apiService.post<{ invoiceNumber: string }>(`${this.baseUrl}/generate-number`);
  }

  async getInvoiceStatistics(): Promise<{
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    averagePaymentTime: number;
  }> {
    return apiService.get(`${this.baseUrl}/statistics`);
  }

  async markAsPaid(id: string, paymentDate: string): Promise<Invoice> {
    return apiService.patch<Invoice>(`${this.baseUrl}/${id}/mark-paid`, { paymentDate });
  }

  async downloadInvoice(id: string): Promise<Blob> {
    return apiService.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob'
    });
  }
}

export const invoiceService = new InvoiceService();