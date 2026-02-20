import { useState, useEffect, useCallback } from "react";
import { InvoiceData, defaultInvoice } from "@/types/invoice";

const STORAGE_KEY = "invoice_draft";
const SIGNATURE_KEY = "invoice_signature";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useInvoiceStore() {
  const [invoice, setInvoice] = useState<InvoiceData>(() =>
    loadFromStorage(STORAGE_KEY, defaultInvoice)
  );
  const [signature, setSignature] = useState<string | null>(() =>
    localStorage.getItem(SIGNATURE_KEY)
  );

  // Auto-save invoice
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
  }, [invoice]);

  // Auto-save signature
  useEffect(() => {
    if (signature) {
      localStorage.setItem(SIGNATURE_KEY, signature);
    } else {
      localStorage.removeItem(SIGNATURE_KEY);
    }
  }, [signature]);

  const updateInvoice = useCallback(
    (partial: Partial<InvoiceData>) =>
      setInvoice((prev) => ({ ...prev, ...partial })),
    []
  );

  const resetInvoice = useCallback(() => {
    setInvoice(defaultInvoice);
    setSignature(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SIGNATURE_KEY);
  }, []);

  return { invoice, updateInvoice, signature, setSignature, resetInvoice };
}
