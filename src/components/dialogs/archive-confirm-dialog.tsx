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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold">Archive user</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Archive <strong>{email}</strong>? They won't be able to login.
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isArchiving} variant="destructive">
            {isArchiving ? "Archiving…" : "Archive"}
          </Button>
        </div>
      </div>
    </div>
  );
}
