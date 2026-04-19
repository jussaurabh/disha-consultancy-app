import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { rolesApi, type Role } from "@/api/roles";
import { permissionsApi, type Permission } from "@/api/permissions";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  permission_codes: z.array(z.string()).min(1, "Select at least one permission"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

function groupPermissionsByCategory(permissions: Permission[]) {
  const grouped: Record<string, Permission[]> = {};
  for (const perm of permissions) {
    const category = perm.category || "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(perm);
  }
  return grouped;
}

function RoleForm({
  open,
  role,
  onClose,
  onSuccess,
}: {
  open: boolean;
  role: Role | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name ?? "",
      permission_codes: role?.permissions?.map((p) => p.code) ?? [],
    },
  });

  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => permissionsApi.listPermissions().then((r) => r.data),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: (values: RoleFormValues) => {
      // Build map: code -> ID from the permissions list
      const permissionIdMap = Object.fromEntries(
        (permissions || []).map((p) => [p.code, p._id])
      );

      // Map selected codes to IDs before sending
      const payload = {
        name: values.name,
        permission_ids: values.permission_codes.map((code) => permissionIdMap[code]),
      };

      return rolesApi.createRole(payload).then((r) => r.data);
    },
    onSuccess: () => {
      onSuccess();
      form.reset();
      onClose();
      toast.success("Role created");
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create role";
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: RoleFormValues) => {
      if (!role) return Promise.reject(new Error("No role"));

      // Build map: code -> ID from the permissions list
      const permissionIdMap = Object.fromEntries(
        (permissions || []).map((p) => [p.code, p._id])
      );

      // Map selected codes to IDs before sending
      const payload = {
        name: values.name,
        permission_ids: values.permission_codes.map((code) => permissionIdMap[code]),
      };

      return rolesApi.updateRole(role._id, payload).then((r) => r.data);
    },
    onSuccess: () => {
      onSuccess();
      form.reset();
      onClose();
      toast.success("Role updated");
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to update role";
      toast.error(msg);
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const grouped = groupPermissionsByCategory(permissions ?? []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">{role ? "Edit role" : "Create role"}</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => {
              if (role) {
                updateMutation.mutate(v);
              } else {
                createMutation.mutate(v);
              }
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Editor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="mb-3 block">Permissions</FormLabel>
              {Object.entries(grouped).map(([category, perms]) => (
                <div key={category} className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">{category}</h4>
                  <div className="space-y-2">
                    {perms.map((perm) => (
                      <FormField
                        key={perm._id}
                        control={form.control}
                        name="permission_codes"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(perm.code)}
                                onCheckedChange={(checked) => {
                                  const codes = field.value;
                                  if (checked) {
                                    field.onChange([...codes, perm.code]);
                                  } else {
                                    field.onChange(codes.filter((c) => c !== perm.code));
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="flex-1">
                              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                {perm.name}
                              </label>
                              {perm.description && <p className="text-xs text-muted-foreground">{perm.description}</p>}
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {(createMutation.isError || updateMutation.isError) && (
              <p className="text-destructive text-sm">
                {(createMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                  (updateMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                  "Failed to save role"}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function RolesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.listRoles().then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setDeleteConfirmOpen(false);
      setRoleToDelete(null);
      toast.success("Role deleted");
    },
    onError: (error) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to delete role";
      toast.error(msg);
    },
  });

  const openCreateForm = () => {
    setSelectedRole(null);
    setFormOpen(true);
  };

  const openEditForm = (role: Role) => {
    setSelectedRole(role);
    setFormOpen(true);
  };

  const openDeleteConfirm = (role: Role) => {
    setRoleToDelete(role);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      deleteMutation.mutate(roleToDelete._id);
    }
  };

  const canCreate = user?.permission_codes?.includes("role:create");
  const canEdit = user?.permission_codes?.includes("role:edit");
  const canDelete = user?.permission_codes?.includes("role:delete");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!roles) {
    return <div>Error loading roles</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Roles</h1>
        {canCreate && (
          <Button onClick={openCreateForm} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create role
          </Button>
        )}
      </div>

      {roles.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No roles yet</p>
          {canCreate && (
            <Button onClick={openCreateForm} variant="outline" className="mt-4">
              Create first role
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium">Name</th>
                <th className="text-left py-2 px-4 font-medium">Permissions</th>
                <th className="text-left py-2 px-4 font-medium">Created</th>
                {(canEdit || canDelete) && <th className="text-right py-2 px-4 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role._id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {role.name}
                      {role.is_system && <Badge variant="secondary">System</Badge>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {format(new Date(role.created_at), "MMM d, yyyy")}
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="py-3 px-4 text-right">
                      {!role.is_system && (canEdit || canDelete) ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEdit && (
                              <DropdownMenuItem onClick={() => openEditForm(role)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <DropdownMenuItem onClick={() => openDeleteConfirm(role)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RoleForm
        open={formOpen}
        role={selectedRole}
        onClose={() => {
          setFormOpen(false);
          setSelectedRole(null);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["roles"] });
        }}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete role"
        message={
          roleToDelete
            ? `Are you sure you want to delete "${roleToDelete.name}"? This action cannot be undone.`
            : "Are you sure?"
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setRoleToDelete(null);
        }}
        isLoading={deleteMutation.isPending}
        destructive
      />
    </div>
  );
}
