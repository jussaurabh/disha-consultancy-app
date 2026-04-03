import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Permissions</h1>
        <p className="text-muted-foreground mt-2">View available consultancy permissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Permissions list coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
