"use client";

import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { orgsApi } from "@/api/orgs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UiVariation } from "@/components/ui/ui-variation";
import { TabSwitcher } from "@/components/ui/tab-switcher";
import { FiltersBar } from "./filters-bar";
import { Plus, Loader2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrganizationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "employees" ? "employees" : "organizations";

  const { data: response, isLoading } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => orgsApi.listOrgs(),
  });

  const orgs = response?.data ?? [];
  const total = response?.total;
  const showCounts = !isLoading && total !== undefined;

  const handleTabChange = (value: string) => {
    setSearchParams(value === "employees" ? { tab: "employees" } : {});
  };

  const isOrganizationsTab = tab === "organizations";
  const filtersBarKey = isOrganizationsTab ? "organizations" : "employees";

  const uiVariationProps = isOrganizationsTab
    ? {
        variant: "index" as const,
        eyebrow: showCounts ? `Client companies · ${total} total` : undefined,
        title: "Organizations",
        className: "px-0",
        actions: (
          <>
            <Button
              variant="outline"
              className="h-10 rounded-md px-4 font-body text-[13px] font-semibold"
            >
              Export
            </Button>
            <Link to="/organizations/new">
              <Button className="h-10 gap-2 rounded-md bg-accent px-[18px] font-body text-[13px] font-semibold text-surface hover:bg-accent/90">
                <Plus className="size-[13px]" />
                Create organization
              </Button>
            </Link>
          </>
        ),
      }
    : {
        variant: "index" as const,
        eyebrow: "People",
        title: "Employees",
        className: "px-0",
        actions: (
          <>
            <Button
              variant="outline"
              className="h-10 rounded-md px-4 font-body text-[13px] font-semibold"
            >
              Import CSV
            </Button>
            <Button className="h-10 gap-2 rounded-md bg-accent px-[18px] font-body text-[13px] font-semibold text-surface hover:bg-accent/90">
              <Plus className="size-[13px]" />
              Add employee
            </Button>
          </>
        ),
      };

  return (
    <div>
      <UiVariation {...uiVariationProps} />
      <TabSwitcher
        className="mt-9"
        value={tab}
        onValueChange={handleTabChange}
        items={[
          { value: "organizations", label: "All organizations", count: showCounts ? total : undefined },
          { value: "employees", label: "Employees" },
        ]}
      />
      <FiltersBar key={filtersBarKey} tab={tab} className="mt-6" />
      {isOrganizationsTab ? (
        <Card className="mt-6">
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted" />
              </div>
            ) : orgs.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">
                No organizations yet.
              </p>
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
                    {orgs.map((org, index) => (
                      <TableRow
                        key={index}
                        className="cursor-pointer hover:bg-muted/30"
                        onClick={() => navigate(`/organizations/${org._id}`)}
                      >
                        <TableCell className="font-medium">
                          <Link
                            to={`/organizations/${org._id}`}
                            className="text-foreground hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {org.company_name}
                          </Link>
                        </TableCell>
                        <TableCell>{org.state}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              org.status === "active"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {org.status || "active"}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-8"
                              >
                                <MoreVertical className="size-4" />
                                <span className="sr-only">Open actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/organizations/${org._id}`}>View</Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardContent>
            <p className="text-sm text-muted text-center py-4">
              No employees to show yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}