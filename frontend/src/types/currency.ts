export enum Currency {
  BRL = "BRL",
  USD = "USD",
  EUR = "EUR",
  AUD = "AUD",
  CAD = "CAD",
}

export const CurrencySymbol: Record<Currency, string> = {
  [Currency.BRL]: "R$",
  [Currency.USD]: "$",
  [Currency.EUR]: "€",
  [Currency.AUD]: "A$",
  [Currency.CAD]: "C$",
};

export const formatCurrency = (
  cost: number,
  currency: Currency | null
): string => {
  if (currency === null) {
    return cost.toFixed(2);
  }

  const symbol = CurrencySymbol[currency];
  return `${symbol} ${cost.toFixed(2)}`;
};
