import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { orgsApi } from "@/api/orgs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2 } from "lucide-react";

export default function OrganizationsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => orgsApi.listOrgs().then((r) => r.data),
  });

  const orgs = response?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-2">Manage your client organizations.</p>
        </div>
        <Link to="/organizations/new">
          <Button className="gap-2 bg-[#EE3338] hover:bg-[#D42D31]">
            <Plus className="h-4 w-4" />
            Create Organization
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : orgs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No organizations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgs.map((org) => (
                    <TableRow key={org._id}>
                      <TableCell className="font-medium">{org.company_name}</TableCell>
                      <TableCell>{org.state}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          org.status === "active" 
                            ? "bg-green-50 text-green-700" 
                            : "bg-gray-50 text-gray-700"
                        }`}>
                          {org.status || "active"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/organizations/${org._id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
