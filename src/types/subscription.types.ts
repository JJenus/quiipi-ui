import { BaseEntity } from './common.types';

export enum SubscriptionType {
  DOMAIN = 'DOMAIN',
  HOSTING = 'HOSTING',
  SSL = 'SSL',
  EMAIL = 'EMAIL',
  TOOL = 'TOOL',
  OTHER = 'OTHER'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  YEARLY = 'YEARLY',
  ONE_TIME = 'ONE_TIME'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING'
}

export enum ExpiryStatus {
  HEALTHY = 'HEALTHY',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED'
}

export interface Subscription extends BaseEntity {
  name: string;
  type: SubscriptionType;
  provider: string;
  providerAccountId?: string;
  projectId?: string;
  clientId?: string;
  domainName?: string;
  hostingPlan?: string;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  purchaseDate: string;
  startDate: string;
  expiryDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  renewalUrl?: string;
  loginCredentials?: string;
  notes?: string;
  notifyDaysBefore: number;
  daysUntilExpiry: number;
  isExpiringSoon: boolean;
  expiryStatus: ExpiryStatus;
  project?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    companyName: string;
  };
}

export interface SubscriptionSummary {
  id: string;
  name: string;
  type: SubscriptionType;
  provider: string;
  cost: number;
  currency: string;
  expiryDate: string;
  daysUntilExpiry: number;
  expiryStatus: ExpiryStatus;
  relatedTo: string;
}

export interface SubscriptionCreateRequest {
  name: string;
  type: SubscriptionType;
  provider: string;
  providerAccountId?: string;
  projectId?: string;
  clientId?: string;
  domainName?: string;
  hostingPlan?: string;
  cost: number;
  currency?: string;
  billingCycle: BillingCycle;
  purchaseDate?: string;
  startDate?: string;
  expiryDate: string;
  autoRenew?: boolean;
  renewalUrl?: string;
  loginCredentials?: string;
  notes?: string;
  notifyDaysBefore?: number;
}

export interface SubscriptionUpdateRequest {
  name?: string;
  type?: SubscriptionType;
  provider?: string;
  providerAccountId?: string;
  domainName?: string;
  hostingPlan?: string;
  cost?: number;
  currency?: string;
  billingCycle?: BillingCycle;
  startDate?: string;
  expiryDate?: string;
  autoRenew?: boolean;
  renewalUrl?: string;
  loginCredentials?: string;
  notes?: string;
  notifyDaysBefore?: number;
}

export interface SubscriptionRenewalRequest {
  newExpiryDate: string;
  renewalCost?: number;
  notes?: string;
}

export interface SubscriptionFilters {
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  expiring?: boolean;
  days?: number;
  clientId?: string;
  projectId?: string;
}
