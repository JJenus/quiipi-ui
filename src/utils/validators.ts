export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

export const isWithinRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const isFutureDate = (date: string | Date): boolean => {
  return new Date(date) > new Date();
};

export const isPastDate = (date: string | Date): boolean => {
  return new Date(date) < new Date();
};
