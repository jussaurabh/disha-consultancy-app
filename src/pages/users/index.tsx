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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const inviteSchema = z.object({
  email: z.email("Enter a valid email"),
  role_id: z.string().min(1, "Select a role"),
});

type InviteValues = z.infer<typeof inviteSchema>;

function ChangeRoleDialogContent({
  user,
  onClose,
  onSuccess,
}: {
  user: ConsultancyUser | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user: currentUser } = useAuth();
  const [roleId, setRoleId] = useState(() => {
    const first = user?.role_ids?.[0];
    return typeof first === "string" ? first : (first?._id ?? "");
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      rolesApi
        .listRoles({
          scope: currentUser!.scope,
          scope_id: currentUser!.scope_id ?? undefined,
        })
        .then((r) => r.data),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: () =>
      user
        ? usersApi.updateUserRole(user._id, roleId).then(() => undefined)
        : Promise.reject(new Error("No user")),
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update role";
      toast.error(msg);
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-4">
      <Select value={roleId} onValueChange={setRoleId}>
        <SelectTrigger>
          <SelectValue placeholder="Select role…" />
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
        <p className="text-destructive text-sm">
          {(
            mutation.error as {
              response?: { data?: { message?: string } };
            }
          )?.response?.data?.message ?? "Failed to update role."}
        </p>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </div>
  );
}

function InviteModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role_id: "" },
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      rolesApi
        .listRoles({
          scope: user!.scope,
          scope_id: user!.scope_id ?? undefined,
        })
        .then((r) => r.data),
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (values: InviteValues) =>
      invitesApi
        .createInvite({ ...values, invite_type: "consultancy_user" })
        .then((r) => r.data),
    onSuccess: () => {
      onSuccess();
      form.reset();
      onClose();
      toast.success("Invite sent");
    },
    onError: (error) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to send invite";
      toast.error(msg);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                    />
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
                {(
                  mutation.error as {
                    response?: { data?: { message?: string } };
                  }
                )?.response?.data?.message ?? "Failed to send invite."}
              </p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Sending…" : "Send invite"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const { hasPermission, user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [changeRoleUser, setChangeRoleUser] = useState<ConsultancyUser | null>(
    null,
  );
  const [archiveUser, setArchiveUser] = useState<ConsultancyUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<ConsultancyUser | null>(null);
  const [cancelInvite, setCancelInvite] = useState<Invite | null>(null);
  const [resendInvite, setResendInvite] = useState<Invite | null>(null);
  const [inviteStatusFilter, setInviteStatusFilter] = useState<
    "all" | "pending" | "accepted" | "cancelled"
  >("all");

  const { data: usersResponse, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      usersApi.listUsers({ page: 1, limit: 100 }).then((r) => r.data),
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
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to delete user";
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
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to archive user";
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
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to unarchive user";
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
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to cancel invite";
      toast.error(msg);
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: (invite: Invite) => invitesApi.resendInvite(invite._id),
    onSuccess: () => {
      toast.success("Invite resent");
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      setResendInvite(null);
    },
    onError: (error) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to resend invite";
      toast.error(msg);
    },
  });

  const currentUserId =
    (currentUser as { _id?: string; id?: string })?.id ??
    (currentUser as { _id?: string })?._id;

  const filteredInvites =
    inviteStatusFilter === "all"
      ? inviteList
      : inviteList.filter((inv) => inv.status === inviteStatusFilter);

  return (
    <div className="space-y-6 pb-4 md:pb-6">
      <div className="flex items-center justify-between p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold">User management</h1>
          <p className="text-muted-foreground text-sm">
            Active users and invites.
          </p>
        </div>
        {hasPermission("consultancy_user:invite") && (
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="size-4" />
            Invite user
          </Button>
        )}
      </div>

      <Tabs defaultValue="users" className="w-full px-4 md:px-6">
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
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              No users yet.
            </p>
          )}
          {!usersLoading && userList.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-3 text-left font-medium">
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">
                    Role
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">
                    Member since
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList.map((u) => {
                  const isSelf = u._id === currentUserId;
                  return (
                    <TableRow
                      key={u._id}
                      className={` ${u.is_archived ? "opacity-50" : ""}`}
                    >
                      <TableCell
                        className={`px-4 py-3 font-medium ${u.is_archived ? "line-through" : ""}`}
                      >
                        {u.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {u.role_ids
                          ?.map((r) => (typeof r === "string" ? r : r.name))
                          .join(", ") ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        {!isSelf &&
                          (hasPermission("consultancy_user:edit") ||
                            hasPermission("consultancy_user:delete") ||
                            hasPermission("consultancy_user:archive")) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {hasPermission("consultancy_user:edit") && (
                                  <DropdownMenuItem
                                    onClick={() => setChangeRoleUser(u)}
                                  >
                                    Change role
                                  </DropdownMenuItem>
                                )}
                                {hasPermission("consultancy_user:archive") &&
                                  !u.is_archived && (
                                    <DropdownMenuItem
                                      onClick={() => setArchiveUser(u)}
                                    >
                                      Archive
                                    </DropdownMenuItem>
                                  )}
                                {hasPermission("consultancy_user:archive") &&
                                  u.is_archived && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        unarchiveUserMutation.mutate(u._id)
                                      }
                                    >
                                      Unarchive
                                    </DropdownMenuItem>
                                  )}
                                {hasPermission("consultancy_user:delete") && (
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => setDeleteUser(u)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="invites" className="mt-4">
          <div className="space-y-4">
            <Tabs
              value={inviteStatusFilter}
              onValueChange={(v) =>
                setInviteStatusFilter(v as typeof inviteStatusFilter)
              }
            >
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
                    {inviteStatusFilter === "all"
                      ? "No invites."
                      : `No ${inviteStatusFilter} invites.`}
                  </p>
                )}
                {!invitesLoading && filteredInvites.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="px-4 py-3 text-left font-medium">
                          Email
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">
                          Role
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">
                          Status
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">
                          Invited by
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">
                          Expires at
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvites.map((inv) => {
                        const status = inv.status ?? "pending";
                        const hasCancel =
                          status === "pending" &&
                          hasPermission("invite:cancel");
                        const hasResend =
                          status === "cancelled" &&
                          hasPermission("consultancy_user:invite");

                        return (
                          <TableRow key={inv._id}>
                            <TableCell className="px-4 py-3 font-medium">
                              {inv.email}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-muted-foreground">
                              {inv.role_id?.name ?? "—"}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                  status === "pending"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : status === "accepted"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                                }`}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-muted-foreground">
                              {inv.invited_by?.email ?? "—"}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-muted-foreground">
                              {inv.expires_at &&
                              status === "pending" &&
                              new Date(inv.expires_at) < new Date() ? (
                                <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700">
                                  Expired
                                </span>
                              ) : inv.expires_at ? (
                                format(
                                  new Date(inv.expires_at),
                                  "dd MMM yyyy, hh:mm a",
                                )
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              {hasCancel || hasResend ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {hasCancel && (
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => setCancelInvite(inv)}
                                      >
                                        <X className="size-4" />
                                        Cancel invite
                                      </DropdownMenuItem>
                                    )}
                                    {hasResend && (
                                      <DropdownMenuItem
                                        onClick={() => setResendInvite(inv)}
                                      >
                                        <RotateCcw className="size-4" />
                                        Resend invite
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["invites"] })
        }
      />

      <Dialog
        open={!!changeRoleUser}
        onOpenChange={(open) => {
          if (!open) setChangeRoleUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>{changeRoleUser?.email}</DialogDescription>
          </DialogHeader>
          <ChangeRoleDialogContent
            user={changeRoleUser}
            onClose={() => setChangeRoleUser(null)}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["users"] })
            }
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!archiveUser}
        onOpenChange={(open) => {
          if (!open) setArchiveUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive user</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive{" "}
              {archiveUser?.email ?? "this user"}? They will lose access to the
              consultancy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={archiveUserMutation.isPending}
              onClick={() =>
                archiveUser && archiveUserMutation.mutate(archiveUser._id)
              }
            >
              {archiveUserMutation.isPending ? "Archiving…" : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteUser}
        onOpenChange={(open) => {
          if (!open) setDeleteUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              {deleteUser
                ? `This will remove ${deleteUser.email}'s access. They will not be able to login.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteUser && deleteMutation.mutate(deleteUser._id)
              }
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!cancelInvite}
        onOpenChange={(open) => {
          if (!open) setCancelInvite(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel invite</DialogTitle>
            <DialogDescription>
              {cancelInvite
                ? `Cancel the invite sent to ${cancelInvite.email}?`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              disabled={cancelInviteMutation.isPending}
              onClick={() =>
                cancelInvite && cancelInviteMutation.mutate(cancelInvite._id)
              }
            >
              {cancelInviteMutation.isPending ? "Cancelling…" : "Cancel invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!resendInvite}
        onOpenChange={(open) => {
          if (!open) setResendInvite(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resend invite</DialogTitle>
            <DialogDescription>
              {resendInvite
                ? `Resend the invite to ${resendInvite.email}? They will receive a new email with the invite link.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              disabled={resendInviteMutation.isPending}
              onClick={() =>
                resendInvite && resendInviteMutation.mutate(resendInvite)
              }
            >
              {resendInviteMutation.isPending ? "Resending…" : "Resend invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
