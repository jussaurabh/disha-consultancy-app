import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rolesApi } from "@/api/roles";

export function ChangeRoleModal({
  user,
  open,
  onClose,
  onSuccess,
  onUpdateRole,
}: {
  user: { _id: string; email: string; role_ids?: (string | { _id: string; name: string })[] } | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onUpdateRole: (userId: string, roleId: string) => Promise<unknown>;
}) {
  const [roleId, setRoleId] = useState(() => {
    const first = user?.role_ids?.[0];
    return typeof first === "string" ? first : first?._id ?? "";
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.listRoles().then((r) => r.data),
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => (user ? onUpdateRole(user._id, roleId).then(() => undefined) : Promise.reject(new Error("No user"))),
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Change role</h2>
        <p className="mb-4 text-sm text-muted-foreground">{user.email}</p>
        <Select value={roleId} onValueChange={setRoleId}>
          <SelectTrigger className="mb-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(roles ?? []).map((r) => (
              <SelectItem key={r._id} value={r._id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {mutation.isError && (
          <p className="mb-2 text-destructive text-sm">
            {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to update role."}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
