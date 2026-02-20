import { useInvoiceStore } from "@/hooks/useInvoiceStore";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import DraftSidebar from "@/components/DraftSidebar";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, FileText } from "lucide-react";
import { exportToPdf } from "@/lib/pdfExport";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const {
    invoice, updateInvoice, signature, setSignature, resetInvoice,
    drafts, activeDraftId, addDraft, deleteDraft, renameDraft, switchDraft,
  } = useInvoiceStore();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const filename = `${invoice.invoiceNumber || "invoice"}.pdf`;
      await exportToPdf("invoice-preview", filename);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h1 className="font-display text-lg font-bold tracking-tight text-foreground">Invoice Maker</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetInvoice} className="text-muted-foreground">
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={downloading}>
            <Download className="h-4 w-4 mr-1" /> {downloading ? "Generating…" : "Download PDF"}
          </Button>
        </div>
      </header>

      {/* Split Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Form */}
        <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 p-6 overflow-y-auto lg:h-[calc(100vh-57px)] lg:border-r space-y-6">
          <DraftSidebar
            drafts={drafts}
            activeDraftId={activeDraftId}
            onSwitch={switchDraft}
            onAdd={addDraft}
            onDelete={deleteDraft}
            onRename={renameDraft}
          />
          <Separator />
          <InvoiceForm
            invoice={invoice}
            onChange={updateInvoice}
            signature={signature}
            onSignatureChange={setSignature}
          />
        </div>

        {/* Preview */}
        <div className="flex-1 bg-muted/50 p-6 overflow-auto lg:h-[calc(100vh-57px)]">
          <div className="invoice-shadow rounded-lg overflow-hidden mx-auto" style={{ width: "fit-content" }}>
            <InvoicePreview invoice={invoice} signature={signature} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
