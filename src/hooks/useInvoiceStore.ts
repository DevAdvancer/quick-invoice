import { useState, useEffect, useCallback } from "react";
import { InvoiceData, InvoiceDraft, defaultInvoice } from "@/types/invoice";

const DRAFTS_KEY = "invoice_drafts";
const ACTIVE_KEY = "invoice_active_draft";

function loadDrafts(): InvoiceDraft[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDrafts(drafts: InvoiceDraft[]) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

function createNewDraft(name?: string): InvoiceDraft {
  return {
    id: crypto.randomUUID(),
    name: name || "Untitled Invoice",
    invoice: { ...defaultInvoice, items: [{ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }] },
    signature: null,
    updatedAt: Date.now(),
  };
}

export function useInvoiceStore() {
  const [drafts, setDrafts] = useState<InvoiceDraft[]>(() => {
    const existing = loadDrafts();
    if (existing.length > 0) return existing;
    // Migrate old single-draft data
    try {
      const oldDraft = localStorage.getItem("invoice_draft");
      const oldSig = localStorage.getItem("invoice_signature");
      if (oldDraft) {
        const invoice = JSON.parse(oldDraft) as InvoiceData;
        // migrate old currency symbol to code
        if (invoice.currency === "$") invoice.currency = "USD";
        const draft: InvoiceDraft = {
          id: crypto.randomUUID(),
          name: invoice.invoiceNumber || "Untitled Invoice",
          invoice,
          signature: oldSig || null,
          updatedAt: Date.now(),
        };
        localStorage.removeItem("invoice_draft");
        localStorage.removeItem("invoice_signature");
        return [draft];
      }
    } catch { /* ignore */ }
    return [createNewDraft()];
  });

  const [activeDraftId, setActiveDraftId] = useState<string>(() => {
    const saved = localStorage.getItem(ACTIVE_KEY);
    const d = loadDrafts();
    if (saved && d.some((dr) => dr.id === saved)) return saved;
    return drafts[0]?.id || "";
  });

  const activeDraft = drafts.find((d) => d.id === activeDraftId) || drafts[0];

  // Persist drafts
  useEffect(() => {
    saveDrafts(drafts);
  }, [drafts]);

  // Persist active ID
  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, activeDraftId);
  }, [activeDraftId]);

  const updateInvoice = useCallback(
    (partial: Partial<InvoiceData>) => {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === activeDraftId
            ? { ...d, invoice: { ...d.invoice, ...partial }, updatedAt: Date.now() }
            : d
        )
      );
    },
    [activeDraftId]
  );

  const setSignature = useCallback(
    (sig: string | null) => {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === activeDraftId ? { ...d, signature: sig, updatedAt: Date.now() } : d
        )
      );
    },
    [activeDraftId]
  );

  const addDraft = useCallback((name?: string) => {
    const nd = createNewDraft(name);
    setDrafts((prev) => [...prev, nd]);
    setActiveDraftId(nd.id);
    return nd.id;
  }, []);

  const deleteDraft = useCallback(
    (id: string) => {
      setDrafts((prev) => {
        const next = prev.filter((d) => d.id !== id);
        if (next.length === 0) {
          const nd = createNewDraft();
          setActiveDraftId(nd.id);
          return [nd];
        }
        if (activeDraftId === id) {
          setActiveDraftId(next[0].id);
        }
        return next;
      });
    },
    [activeDraftId]
  );

  const renameDraft = useCallback((id: string, name: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name } : d))
    );
  }, []);

  const switchDraft = useCallback((id: string) => {
    setActiveDraftId(id);
  }, []);

  const resetInvoice = useCallback(() => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === activeDraftId
          ? {
              ...d,
              invoice: { ...defaultInvoice, items: [{ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }] },
              signature: null,
              updatedAt: Date.now(),
            }
          : d
      )
    );
  }, [activeDraftId]);

  return {
    invoice: activeDraft?.invoice || defaultInvoice,
    signature: activeDraft?.signature || null,
    updateInvoice,
    setSignature,
    resetInvoice,
    // Drafts
    drafts,
    activeDraftId: activeDraft?.id || "",
    activeDraftName: activeDraft?.name || "",
    addDraft,
    deleteDraft,
    renameDraft,
    switchDraft,
  };
}
