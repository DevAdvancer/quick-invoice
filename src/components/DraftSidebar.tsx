import { InvoiceDraft } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  drafts: InvoiceDraft[];
  activeDraftId: string;
  onSwitch: (id: string) => void;
  onAdd: (name?: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export default function DraftSidebar({ drafts, activeDraftId, onSwitch, onAdd, onDelete, onRename }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startRename = (d: InvoiceDraft) => {
    setEditingId(d.id);
    setEditName(d.name);
  };

  const commitRename = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const sorted = [...drafts].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Drafts</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onAdd()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {sorted.map((d) => (
          <div
            key={d.id}
            className={cn(
              "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
              d.id === activeDraftId
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => onSwitch(d.id)}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            {editingId === d.id ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => e.key === "Enter" && commitRename()}
                className="h-6 text-xs px-1 py-0"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="truncate flex-1 text-xs"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startRename(d);
                }}
              >
                {d.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(d.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
