import { BaseEntity } from './common.types';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  CASH = 'CASH'
}

export interface InvoiceItem {
  id?: string;
  description: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  discountPercentage?: number;
  amount: number;
  notes?: string;
}

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  pendingBalance: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  termsAndConditions?: string;
  daysOverdue: number;
  isOverdue: boolean;
}

export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  pendingBalance: number;
  status: InvoiceStatus;
  isOverdue: boolean;
}

export interface Payment extends BaseEntity {
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface InvoiceCreateRequest {
  clientId: string;
  projectId?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItemRequest[];
  taxRate?: number;
  discountAmount?: number;
  notes?: string;
  termsAndConditions?: string;
}

export interface InvoiceItemRequest {
  description: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  discountPercentage?: number;
  notes?: string;
}

export interface InvoiceUpdateRequest {
  issueDate?: string;
  dueDate?: string;
  items?: InvoiceItemRequest[];
  taxRate?: number;
  discountAmount?: number;
  notes?: string;
  termsAndConditions?: string;
  status?: InvoiceStatus;
}

export interface InvoicePaymentRequest {
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  overdue?: boolean;
}
