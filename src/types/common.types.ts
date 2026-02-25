export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  DELETED = 'DELETED'
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}


export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Timezone {
  id: string;
  name: string;
  offset: string;
  label: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}