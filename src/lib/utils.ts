
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

export function getApiBase(): string {
  const base = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
  // Return empty string to use same-origin relative paths by default
  return base && base.trim().length > 0 ? base.replace(/\/$/, '') : '';
}