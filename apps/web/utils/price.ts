export function formatPrice(amount: number, currency: string): string {
  const formatted = amount < 1 ? amount.toFixed(4) : amount.toFixed(2);
  return `${formatted} ${currency}`;
}
