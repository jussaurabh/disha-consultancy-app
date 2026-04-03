import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_SECTIONS } from "@/config/dashboard-sections";
import { consultancyApi } from "@/api/consultancy";
import { useAuth } from "@/providers/use-auth";
import { RequirePermission } from "@/components/require-permission";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { hasPermission } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["consultancy-stats"],
    queryFn: () => consultancyApi.getStats().then((r) => r.data),
  });

  const visibleSections = DASHBOARD_SECTIONS.filter((section) =>
    section.permissionCodes.some((code) => hasPermission(code))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your consultancy.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          stats && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.orgs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.roles}</div>
                </CardContent>
              </Card>
            </>
          )
        )}
      </div>

      {/* Quick Actions */}
      {visibleSections.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleSections.map((section) => (
              <RequirePermission key={section.href} permissionCodes={section.permissionCodes}>
                <Link to={section.href}>
                  <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <section.icon className="h-5 w-5" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </RequirePermission>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
