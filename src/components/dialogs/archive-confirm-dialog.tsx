import { Button } from "@/components/ui/button";

export function ArchiveConfirmDialog({
  open,
  email,
  isArchiving,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  email: string;
  isArchiving?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55">
      <div className="min-w-[560px] max-w-[640px] rounded-xl border bg-background p-6 shadow-lg">
        <h2 className="mb-2 text-[16px] font-semibold font-display">Archive user</h2>
        <p className="mb-6 text-[13px] text-muted-foreground font-body">
          Archive <strong>{email}</strong>? They won&apos;t be able to login.
        </p>
        <div className="flex justify-end gap-2 flex-wrap">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isArchiving} variant="destructive" size="sm">
            {isArchiving ? "Archiving…" : "Archive"}
          </Button>
        </div>
      </div>
    </div>
  );
}
