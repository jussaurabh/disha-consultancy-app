import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { permissionsApi, type Permission } from "@/api/permissions";
import { useAuth } from "@/providers/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

function groupPermissionsByCategory(permissions: Permission[]) {
  const grouped: Record<string, Permission[]> = {};
  for (const perm of permissions) {
    const category = perm.category || "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(perm);
  }
  return grouped;
}

export default function PermissionsPage() {
  const { user } = useAuth();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => permissionsApi.listPermissions().then((r) => r.data),
  });

  if (!user?.permission_codes?.includes("permission:list")) {
    return (
      <div className="rounded-lg border p-4 text-center">
        <p className="text-muted-foreground">You don't have permission to view permissions</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!permissions) {
    return <div>Error loading permissions</div>;
  }

  const grouped = groupPermissionsByCategory(permissions);

  if (permissions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No permissions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <p className="text-sm text-muted-foreground">
          {permissions.length} permission{permissions.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, perms]) => (
          <div key={category}>
            <h2 className="mb-3 text-lg font-semibold capitalize">{category}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium">Code</th>
                    <th className="text-left py-2 px-4 font-medium">Name</th>
                    <th className="text-left py-2 px-4 font-medium">Description</th>
                    <th className="text-left py-2 px-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {perms.map((perm) => (
                    <tr key={perm._id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-xs">{perm.code}</td>
                      <td className="py-3 px-4">{perm.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{perm.description || "-"}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {format(new Date(perm._id), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Permissions are managed by your organization's administrator. Contact your admin if you need to request new permissions.
        </p>
      </div>
    </div>
  );
}
