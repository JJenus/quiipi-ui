import { Address, BaseEntity, Status } from './common.types';

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEAD = 'LEAD'
}

export interface Client extends BaseEntity {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  taxId?: string;
  billingAddress: Address;
  shippingAddress: Address;
  paymentTerms?: string;
  creditLimit?: number;
  currency: string;
  status: ClientStatus;
  notes?: string;
  userId: string;
}

export interface ClientSummary {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  status: ClientStatus;
  pendingBalance: number;
  activeProjectsCount: number;
  overdueInvoicesCount: number;
}

export interface ClientCreateRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  taxId?: string;
  billingAddress: Address;
  shippingAddress: Address;
  paymentTerms?: string;
  creditLimit?: number;
  currency?: string;
  notes?: string;
}

export interface ClientUpdateRequest {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  website?: string;
  taxId?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  paymentTerms?: string;
  creditLimit?: number;
  status?: ClientStatus;
  notes?: string;
}

export interface ClientFilters {
  status?: ClientStatus;
  search?: string;
  page?: number;
  limit?: number;
}
