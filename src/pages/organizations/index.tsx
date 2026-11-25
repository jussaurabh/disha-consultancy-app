"use client";

import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { orgsApi } from "@/api/orgs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiltersBar } from "./filters-bar";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Plus,
  Loader2,
  MoreVertical,
  Download,
  Upload,
  Ellipsis,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TABS = [
  { id: "organizations", label: "All organizations" },
  { id: "employees", label: "Employees" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const tab: TabId = rawTab === "employees" ? "employees" : "organizations";

  const { data: response, isLoading } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => orgsApi.listOrgs().then((r) => r.data),
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
        actions: (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 rounded-md px-4 font-body text-[13px] font-semibold"
                >
                  <Ellipsis className="size-3.75 text-muted" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Organizations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
    <div className="pb-4 md:pb-6">
      {/* Section tabs */}
      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="bg-surface md:px-6"
      >
        <TabsList variant="line">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              count={t.id === "organizations" && showCounts ? total : undefined}
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <PageHeader {...uiVariationProps} />
      <FiltersBar key={filtersBarKey} tab={tab} className="mt-6" />

      {tab === "organizations" && (
        <div className="mx-4 mt-6 md:mx-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted" />
            </div>
          ) : orgs.length === 0 ? (
            <EmptyState
              variant="no-data"
              title="No organizations yet"
              subTitle="Get started by creating your first organization."
              actions={
                <Link to="/organizations/new">
                  <Button className="h-10 gap-2 rounded-md bg-accent px-4.5 font-body text-[13px] font-semibold text-surface hover:bg-accent/90">
                    <Plus className="size-3.25" />
                    Create organization
                  </Button>
                </Link>
              }
            />
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
                      className="cursor-pointer"
                      onClick={() => navigate(`/organizations/${org._id}`)}
                    >
                      <TableCell className="font-medium">
                        <Link
                          to={`/organizations/${org._id}`}
                          className="text-foreground hover:underline"
                        >
                          {org.company_name}
                        </Link>
                      </TableCell>
                      <TableCell>{org.state}</TableCell>
                      <TableCell>
                        {org.status === "active" ? (
                          <Badge dot shape="tag">
                            Active
                          </Badge>
                        ) : (
                          <Badge dot shape="tag" variant="destructive">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
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
        </div>
      )}

      {tab === "employees" && (
        <div className="mx-4 mt-6 md:mx-6">
          <EmptyState
            variant="empty"
            title="No employees yet"
            subTitle="Add employees to start managing payroll."
            actions={
              <Button className="h-10 gap-2 rounded-md bg-accent px-[18px] font-body text-[13px] font-semibold text-surface hover:bg-accent/90">
                <Plus className="size-[13px]" />
                Add employee
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
