// src/types/billing.types.ts
export enum BankAccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  BUSINESS = 'BUSINESS',
}

export interface BankAccount {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountType: BankAccountType;
  routingNumber: string;
  accountNumber: string; // Last 4 digits only for display
  currency: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentLink {
  id: string;
  name: string;
  url: string;
  provider: 'PAYPAL' | 'STRIPE' | 'VENMO' | 'CASHAPP' | 'OTHER';
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingSettings {
  bankAccounts: BankAccount[];
  paymentLinks: PaymentLink[];
  defaultPaymentMethod?: 'BANK' | 'PAYMENT_LINK';
  invoicePaymentInstructions?: string;
}

export interface CreateBankAccountRequest {
  accountHolderName: string;
  bankName: string;
  accountType: BankAccountType;
  routingNumber: string;
  accountNumber: string;
  currency?: string;
  isDefault?: boolean;
}

export interface CreatePaymentLinkRequest {
  name: string;
  url: string;
  provider: PaymentLink['provider'];
  description?: string;
  isDefault?: boolean;
}