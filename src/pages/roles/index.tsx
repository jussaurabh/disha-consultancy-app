import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roles</h1>
        <p className="text-muted-foreground mt-2">Manage consultancy roles and permissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Roles management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
