// src/constants/billing.ts
export const BANK_ACCOUNT_TYPES = [
  { value: 'CHECKING', label: 'Checking' },
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'BUSINESS', label: 'Business' },
] as const;

export const PAYMENT_PROVIDERS = [
    { value: 'PAYSTACK', label: 'Paystack', icon: 'P' },
  { value: 'PAYPAL', label: 'PayPal', icon: '💰' },
  { value: 'STRIPE', label: 'Stripe', icon: '💳' },
  { value: 'VENMO', label: 'Venmo', icon: '📱' },
  { value: 'CASHAPP', label: 'Cash App', icon: '💵' },
  { value: 'WISE', label: 'Wise', icon: '🌍' },
  { value: 'REVOLUT', label: 'Revolut', icon: '🏦' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏛️' },
  { value: 'CRYPTO', label: 'Cryptocurrency', icon: '₿' },
  { value: 'OTHER', label: 'Other', icon: '🔗' },
] as const;

// You can easily add more providers without touching the component
export const getProviderByValue = (value: string) => {
  return PAYMENT_PROVIDERS.find(p => p.value === value) || PAYMENT_PROVIDERS[PAYMENT_PROVIDERS.length - 1];
};