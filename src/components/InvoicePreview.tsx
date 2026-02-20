import { InvoiceData } from "@/types/invoice";
import { useMemo } from "react";

interface Props {
  invoice: InvoiceData;
  signature: string | null;
}

export default function InvoicePreview({ invoice, signature }: Props) {
  const { subtotal, discount, tax, total } = useMemo(() => {
    const sub = invoice.items.reduce((s, i) => s + i.quantity * i.rate, 0);
    const disc = sub * (invoice.discountRate / 100);
    const afterDiscount = sub - disc;
    const t = afterDiscount * (invoice.taxRate / 100);
    return { subtotal: sub, discount: disc, tax: t, total: afterDiscount + t };
  }, [invoice]);

  const cur = invoice.currency || "$";

  return (
    <div
      id="invoice-preview"
      className="bg-white text-gray-900 p-10 w-[210mm] min-h-[297mm] mx-auto"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "13px", lineHeight: 1.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#1a1f2e" }}>
            INVOICE
          </h1>
          <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
            {invoice.invoiceNumber}
          </p>
        </div>
        <div className="text-right text-xs" style={{ color: "#6b7280" }}>
          {invoice.issueDate && <p>Issued: {invoice.issueDate}</p>}
          {invoice.dueDate && <p>Due: {invoice.dueDate}</p>}
        </div>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#d97706" }}>From</p>
          <p className="font-semibold">{invoice.fromName || "Your Name"}</p>
          {invoice.fromEmail && <p style={{ color: "#6b7280" }}>{invoice.fromEmail}</p>}
          {invoice.fromPhone && <p style={{ color: "#6b7280" }}>{invoice.fromPhone}</p>}
          {invoice.fromAddress && <p className="whitespace-pre-line" style={{ color: "#6b7280" }}>{invoice.fromAddress}</p>}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#d97706" }}>Bill To</p>
          <p className="font-semibold">{invoice.toName || "Client Name"}</p>
          {invoice.toEmail && <p style={{ color: "#6b7280" }}>{invoice.toEmail}</p>}
          {invoice.toAddress && <p className="whitespace-pre-line" style={{ color: "#6b7280" }}>{invoice.toAddress}</p>}
        </div>
      </div>

      {/* Items table */}
      <table className="w-full mb-8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
            <th className="text-left py-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>Description</th>
            <th className="text-right py-2 text-[10px] font-semibold uppercase tracking-widest w-20" style={{ color: "#6b7280" }}>Qty</th>
            <th className="text-right py-2 text-[10px] font-semibold uppercase tracking-widest w-24" style={{ color: "#6b7280" }}>Rate</th>
            <th className="text-right py-2 text-[10px] font-semibold uppercase tracking-widest w-24" style={{ color: "#6b7280" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td className="py-2">{item.description || "—"}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">{cur}{item.rate.toFixed(2)}</td>
              <td className="py-2 text-right">{cur}{(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-10">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "#6b7280" }}>Subtotal</span>
            <span>{cur}{subtotal.toFixed(2)}</span>
          </div>
          {invoice.discountRate > 0 && (
            <div className="flex justify-between">
              <span style={{ color: "#6b7280" }}>Discount ({invoice.discountRate}%)</span>
              <span>-{cur}{discount.toFixed(2)}</span>
            </div>
          )}
          {invoice.taxRate > 0 && (
            <div className="flex justify-between">
              <span style={{ color: "#6b7280" }}>Tax ({invoice.taxRate}%)</span>
              <span>{cur}{tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 font-bold text-base" style={{ borderTop: "2px solid #1a1f2e" }}>
            <span>Total</span>
            <span>{cur}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#d97706" }}>Notes</p>
          <p className="whitespace-pre-line text-sm" style={{ color: "#6b7280" }}>{invoice.notes}</p>
        </div>
      )}

      {/* Signature */}
      {signature && (
        <div className="mt-10">
          <img src={signature} alt="Signature" className="h-14 mb-1" />
          <div className="w-48" style={{ borderTop: "1px solid #d1d5db" }}>
            <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Authorized Signature</p>
          </div>
        </div>
      )}
    </div>
  );
}
