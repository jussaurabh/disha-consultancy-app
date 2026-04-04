import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Plus, RotateCcw, X } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { invitesApi, type Invite } from "@/api/invites";
import { usersApi, type ConsultancyUser } from "@/api/users";
import { rolesApi } from "@/api/roles";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeRoleModal } from "@/components/dialogs/change-role-modal";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { ArchiveConfirmDialog } from "@/components/dialogs/archive-confirm-dialog";

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role_id: z.string().min(1, "Select a role"),
});

type InviteValues = z.infer<typeof inviteSchema>;

function InviteModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role_id: "" },
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.listRoles().then((r) => r.data),
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (values: InviteValues) => invitesApi.createInvite(values).then((r) => r.data),
    onSuccess: () => {
      onSuccess();
      form.reset();
      onClose();
      toast.success("Invite sent");
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to send invite";
      toast.error(msg);
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Invite user</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(roles ?? []).map((r) => (
                        <SelectItem key={r._id} value={r._id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mutation.isError && (
              <p className="text-destructive text-sm">
                {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to send invite."}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Sending…" : "Send invite"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { hasPermission, user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [changeRoleUser, setChangeRoleUser] = useState<ConsultancyUser | null>(null);
  const [archiveUser, setArchiveUser] = useState<ConsultancyUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<ConsultancyUser | null>(null);
  const [cancelInvite, setCancelInvite] = useState<Invite | null>(null);
  const [resendInvite, setResendInvite] = useState<Invite | null>(null);
  const [inviteStatusFilter, setInviteStatusFilter] = useState<"all" | "pending" | "accepted" | "cancelled">("all");

  const { data: usersResponse, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.listUsers({ page: 1, limit: 100 }).then((r) => r.data),
  });
  const { data: invites, isLoading: invitesLoading } = useQuery({
    queryKey: ["invites"],
    queryFn: () => invitesApi.listInvites().then((r) => r.data),
  });

  const userList = usersResponse?.data ?? [];
  const inviteList = Array.isArray(invites) ? invites : [];

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteUser(null);
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to delete user";
      toast.error(msg);
    },
  });

  const archiveUserMutation = useMutation({
    mutationFn: (userId: string) => usersApi.archiveUser(userId),
    onSuccess: () => {
      toast.success("User archived");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setArchiveUser(null);
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to archive user";
      toast.error(msg);
    },
  });

  const unarchiveUserMutation = useMutation({
    mutationFn: (userId: string) => usersApi.unarchiveUser(userId),
    onSuccess: () => {
      toast.success("User unarchived");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to unarchive user";
      toast.error(msg);
    },
  });

  const cancelInviteMutation = useMutation({
    mutationFn: (id: string) => invitesApi.cancelInvite(id),
    onSuccess: () => {
      toast.success("Invite cancelled");
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      setCancelInvite(null);
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to cancel invite";
      toast.error(msg);
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: (invite: Invite) => invitesApi.resendInvite(invite),
    onSuccess: () => {
      toast.success("Invite resent");
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      setResendInvite(null);
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to resend invite";
      toast.error(msg);
    },
  });

  const currentUserId = (currentUser as { _id?: string; id?: string })?.id ?? (currentUser as { _id?: string })?._id;

  const filteredInvites = inviteStatusFilter === "all" ? inviteList : inviteList.filter((inv) => inv.status === inviteStatusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User management</h1>
          <p className="text-muted-foreground text-sm">Active users and invites.</p>
        </div>
        {hasPermission("consultancy_user:invite") && (
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="size-4" />
            Invite user
          </Button>
        )}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          {usersLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          )}
          {!usersLoading && userList.length === 0 && (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No users yet.</p>
          )}
          {!usersLoading && userList.length > 0 && (
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Member since</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u) => {
                    const isSelf = u._id === currentUserId;
                    return (
                      <tr key={u._id} className={`border-b last:border-b-0 hover:bg-muted/30 ${u.is_archived ? "opacity-50" : ""}`}>
                        <td className={`px-4 py-3 font-medium ${u.is_archived ? "line-through" : ""}`}>{u.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {u.role_ids?.map((r) => (typeof r === "string" ? r : r.name)).join(", ") ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                        <td className="px-4 py-3 text-right">
                          {!isSelf && (hasPermission("consultancy_user:edit") || hasPermission("consultancy_user:delete") || hasPermission("consultancy_user:archive")) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {hasPermission("consultancy_user:edit") && (
                                  <DropdownMenuItem onClick={() => setChangeRoleUser(u)}>
                                    Change role
                                  </DropdownMenuItem>
                                )}
                                {hasPermission("consultancy_user:archive") && !u.is_archived && (
                                  <DropdownMenuItem onClick={() => setArchiveUser(u)}>
                                    Archive
                                  </DropdownMenuItem>
                                )}
                                {hasPermission("consultancy_user:archive") && u.is_archived && (
                                  <DropdownMenuItem onClick={() => unarchiveUserMutation.mutate(u._id)}>
                                    Unarchive
                                  </DropdownMenuItem>
                                )}
                                {hasPermission("consultancy_user:delete") && (
                                  <DropdownMenuItem variant="destructive" onClick={() => setDeleteUser(u)}>
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="invites" className="mt-4">
          <div className="space-y-4">
            <Tabs value={inviteStatusFilter} onValueChange={(v) => setInviteStatusFilter(v as typeof inviteStatusFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                {invitesLoading && (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                )}
                {!invitesLoading && filteredInvites.length === 0 && (
                  <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    {inviteStatusFilter === "all" ? "No invites." : `No ${inviteStatusFilter} invites.`}
                  </p>
                )}
                {!invitesLoading && filteredInvites.length > 0 && (
                  <div className="rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Email</th>
                          <th className="px-4 py-3 text-left font-medium">Role</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Invited by</th>
                          <th className="px-4 py-3 text-left font-medium">Expires at</th>
                          <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvites.map((inv) => {
                          const status = inv.status ?? "pending";
                          const hasActions = status === "pending" && hasPermission("invite:cancel");
                          const hasResend = status === "cancelled" && hasPermission("consultancy_user:invite");
                          const showActionsDropdown = hasActions || hasResend;

                          return (
                            <tr key={inv._id} className="border-b last:border-b-0 hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium">{inv.email}</td>
                              <td className="px-4 py-3 text-muted-foreground">{inv.role_id?.name ?? "—"}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                    status === "pending"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                      : status === "accepted"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                                  }`}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{inv.invited_by?.email ?? "—"}</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {inv.expires_at && inv.status === "pending" && new Date(inv.expires_at) < new Date() ? (
                                  <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700">
                                    Expired
                                  </span>
                                ) : inv.expires_at ? (
                                  format(new Date(inv.expires_at), "dd MMM yyyy, hh:mm a")
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {showActionsDropdown ? (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <MoreHorizontal className="size-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {hasActions && (
                                        <DropdownMenuItem variant="destructive" onClick={() => setCancelInvite(inv)}>
                                          <X className="size-4" />
                                          Cancel invite
                                        </DropdownMenuItem>
                                      )}
                                      {hasResend && (
                                        <DropdownMenuItem onClick={() => setResendInvite(inv)}>
                                          <RotateCcw className="size-4" />
                                          Resend invite
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["invites"] })}
      />

      <ChangeRoleModal
        user={changeRoleUser}
        open={!!changeRoleUser}
        onClose={() => setChangeRoleUser(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
        onUpdateRole={(userId, roleId) => usersApi.updateUserRole(userId, roleId).then(() => undefined)}
      />

      <ArchiveConfirmDialog
        open={!!archiveUser}
        email={archiveUser?.email ?? ""}
        isArchiving={archiveUserMutation.isPending}
        onConfirm={() => archiveUser && archiveUserMutation.mutate(archiveUser._id)}
        onCancel={() => setArchiveUser(null)}
      />

      <ConfirmDialog
        open={!!deleteUser}
        title="Delete user"
        message={deleteUser ? `This will remove ${deleteUser.email}'s access. They will not be able to login.` : ""}
        onConfirm={() => deleteUser && deleteMutation.mutate(deleteUser._id)}
        onCancel={() => setDeleteUser(null)}
        isLoading={deleteMutation.isPending}
        destructive
      />

      <ConfirmDialog
        open={!!cancelInvite}
        title="Cancel invite"
        message={cancelInvite ? `Cancel the invite sent to ${cancelInvite.email}?` : ""}
        onConfirm={() => cancelInvite && cancelInviteMutation.mutate(cancelInvite._id)}
        onCancel={() => setCancelInvite(null)}
        isLoading={cancelInviteMutation.isPending}
      />

      <ConfirmDialog
        open={!!resendInvite}
        title="Resend invite"
        message={resendInvite ? `Resend the invite to ${resendInvite.email}? They will receive a new email with the invite link.` : ""}
        onConfirm={() => resendInvite && resendInviteMutation.mutate(resendInvite)}
        onCancel={() => setResendInvite(null)}
        isLoading={resendInviteMutation.isPending}
      />
    </div>
  );
}
