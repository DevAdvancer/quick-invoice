import { InvoiceData, LineItem } from "@/types/invoice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, X } from "lucide-react";
import React, { useRef } from "react";

interface Props {
  invoice: InvoiceData;
  onChange: (partial: Partial<InvoiceData>) => void;
  signature: string | null;
  onSignatureChange: (sig: string | null) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

export default function InvoiceForm({ invoice, onChange, signature, onSignatureChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    onChange({
      items: [...invoice.items, { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }],
    });
  };

  const removeItem = (id: string) => {
    if (invoice.items.length <= 1) return;
    onChange({ items: invoice.items.filter((i) => i.id !== id) });
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    onChange({
      items: invoice.items.map((i) =>
        i.id === id ? { ...i, [field]: value } : i
      ),
    });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onSignatureChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Section title="From (Your Details)">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label htmlFor="fromName">Name / Business</Label>
            <Input id="fromName" value={invoice.fromName} onChange={(e) => onChange({ fromName: e.target.value })} placeholder="Your name or business" />
          </div>
          <div>
            <Label htmlFor="fromEmail">Email</Label>
            <Input id="fromEmail" type="email" value={invoice.fromEmail} onChange={(e) => onChange({ fromEmail: e.target.value })} placeholder="you@email.com" />
          </div>
          <div>
            <Label htmlFor="fromPhone">Phone</Label>
            <Input id="fromPhone" value={invoice.fromPhone} onChange={(e) => onChange({ fromPhone: e.target.value })} placeholder="+1 234 567 890" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="fromAddress">Address</Label>
            <Textarea id="fromAddress" value={invoice.fromAddress} onChange={(e) => onChange({ fromAddress: e.target.value })} placeholder="Street, City, Country" rows={2} />
          </div>
        </div>
      </Section>

      <Section title="Bill To">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label htmlFor="toName">Client Name</Label>
            <Input id="toName" value={invoice.toName} onChange={(e) => onChange({ toName: e.target.value })} placeholder="Client or company name" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="toEmail">Client Email</Label>
            <Input id="toEmail" type="email" value={invoice.toEmail} onChange={(e) => onChange({ toEmail: e.target.value })} placeholder="client@email.com" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="toAddress">Client Address</Label>
            <Textarea id="toAddress" value={invoice.toAddress} onChange={(e) => onChange({ toAddress: e.target.value })} placeholder="Street, City, Country" rows={2} />
          </div>
        </div>
      </Section>

      <Section title="Invoice Details">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="invoiceNumber">Invoice #</Label>
            <Input id="invoiceNumber" value={invoice.invoiceNumber} onChange={(e) => onChange({ invoiceNumber: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input id="issueDate" type="date" value={invoice.issueDate} onChange={(e) => onChange({ issueDate: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={invoice.dueDate} onChange={(e) => onChange({ dueDate: e.target.value })} />
          </div>
        </div>
      </Section>

      <Section title="Line Items">
        <div className="space-y-2">
          {invoice.items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-[1fr_80px_100px_36px] gap-2 items-end">
              <div>
                {idx === 0 && <Label className="text-xs">Description</Label>}
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Service description"
                />
              </div>
              <div>
                {idx === 0 && <Label className="text-xs">Qty</Label>}
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                />
              </div>
              <div>
                {idx === 0 && <Label className="text-xs">Rate</Label>}
                <Input
                  type="number"
                  min={0}
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(item.id)}
                disabled={invoice.items.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={addItem} className="mt-2">
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </Section>

      <Section title="Tax & Discount">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" value={invoice.currency} onChange={(e) => onChange({ currency: e.target.value })} placeholder="$" />
          </div>
          <div>
            <Label htmlFor="taxRate">Tax (%)</Label>
            <Input id="taxRate" type="number" min={0} value={invoice.taxRate} onChange={(e) => onChange({ taxRate: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="discountRate">Discount (%)</Label>
            <Input id="discountRate" type="number" min={0} value={invoice.discountRate} onChange={(e) => onChange({ discountRate: Number(e.target.value) })} />
          </div>
        </div>
      </Section>

      <Section title="Notes">
        <Textarea value={invoice.notes} onChange={(e) => onChange({ notes: e.target.value })} placeholder="Payment terms, thank you note, etc." rows={3} />
      </Section>

      <Section title="Signature">
        <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleSignatureUpload} />
        {signature ? (
          <div className="flex items-center gap-3">
            <img src={signature} alt="Signature" className="h-12 border rounded bg-card p-1" />
            <Button variant="ghost" size="sm" onClick={() => onSignatureChange(null)}>
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" /> Upload Signature
          </Button>
        )}
      </Section>
    </div>
  );
}
