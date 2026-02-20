export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  // Freelancer
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  fromPhone: string;

  // Client
  toName: string;
  toEmail: string;
  toAddress: string;

  // Invoice details
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;

  // Items
  items: LineItem[];

  // Extras
  taxRate: number;
  discountRate: number;
  notes: string;
  currency: string;
}

export interface InvoiceDraft {
  id: string;
  name: string;
  invoice: InvoiceData;
  signature: string | null;
  updatedAt: number;
}

export const defaultInvoice: InvoiceData = {
  fromName: "",
  fromEmail: "",
  fromAddress: "",
  fromPhone: "",
  toName: "",
  toEmail: "",
  toAddress: "",
  invoiceNumber: "INV-001",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  items: [{ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }],
  taxRate: 0,
  discountRate: 0,
  notes: "",
  currency: "USD",
};

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: CurrencyOption[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "COP", symbol: "COL$", name: "Colombian Peso" },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
];

export function getCurrencySymbol(code: string): string {
  return currencies.find((c) => c.code === code)?.symbol || code;
}
