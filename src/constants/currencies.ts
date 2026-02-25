// src/constants/currencies.ts
import { Currency } from "@/types";

export const CURRENCIES: Currency[] = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'VND', name: 'Vietnamese Đồng', symbol: '₫' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find(currency => currency.code === code);
};

export const formatCurrencyWithSymbol = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return `${currencyCode} ${amount.toFixed(2)}`;
  
  return `${currency.symbol}${amount.toFixed(2)}`;
};