import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  destructive,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  destructive?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55">
      <div className="min-w-[560px] max-w-[640px] rounded-xl border bg-background p-6 shadow-lg">
        <h2 className="mb-2 text-[16px] font-semibold font-display">{title}</h2>
        <p className="mb-6 text-[13px] text-muted-foreground font-body">{message}</p>
        <div className="flex justify-end gap-2 flex-wrap">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={destructive ? "destructive" : "default"}
            size="sm"
          >
            {isLoading ? "…" : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
