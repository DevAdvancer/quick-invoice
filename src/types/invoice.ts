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
  currency: "$",
};
