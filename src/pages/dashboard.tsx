import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiBar } from "@/components/ui/kpi-bar";
import { QuickActions } from "@/components/ui/quick-actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useAuth } from "@/providers/use-auth";
import { consultancyApi } from "@/api/consultancy";
import { orgsApi, type Organization } from "@/api/orgs";
import { DASHBOARD_SECTIONS } from "@/config/dashboard-sections";
import {
  format,
  startOfMonth,
  addMonths,
  differenceInCalendarDays,
} from "date-fns";
import { MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface KpiBarItem {
  label: string;
  value: string | number;
  /** Optional secondary line, e.g. "+3 this month" */
  delta?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export function getGreeting(date: Date): string {
  const hours = date.getHours();
  if (hours < 12) return "Good morning";
  if (hours >= 12 && hours < 17) return "Good afternoon";
  return "Good evening";
}

// Helper to capitalize first letter
const capitalize = (str: string) =>
  str.length > 0 ? str[0].toUpperCase() + str.slice(1) : "";

export default function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Compute first name from email local part
  const firstName = user?.email?.split("@")[0]
    ? capitalize(user.email.split("@")[0].split(".")[0])
    : "there";

  // Compute payroll chip - next month's first day
  const today = new Date();
  const nextMonthFirstDay = addMonths(today, 1);
  const daysUntil = differenceInCalendarDays(
    startOfMonth(nextMonthFirstDay),
    today,
  );

  const stats = useQuery({
    queryKey: ["consultancy-stats"],
    queryFn: () => consultancyApi.getStats().then((r) => r.data),
    refetchOnWindowFocus: false,
  });

  const { data: orgs, isLoading: isOrgLoading } = useQuery({
    queryKey: ["orgs-recent"],
    queryFn: () => orgsApi.listOrgs({ limit: 5 }).then((r) => r.data),
    refetchOnWindowFocus: false,
  });

  // Greeting
  const greeting = getGreeting(new Date());

  // KPI items from dashboard sections (deduplicated: Organizations, Users, Roles; Permissions excluded)
  const kpiItems = [
    {
      label: "Organizations",
      value: stats?.data?.orgs ?? "—",
      delta: "+3 this month",
    },
    { label: "Users", value: stats?.data?.users ?? "—" },
    { label: "Roles", value: stats?.data?.roles ?? "—" },
  ];

  // Recent orgs columns config
  const orgColumns = [
    {
      key: "initials",
      header: "Company",
      className: "min-w-0 truncate",
      cell: (org: Organization) => {
        const firstTwoWords = org.company_name.split(" ").slice(0, 2).join(" ");
        const initials = firstTwoWords
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .toUpperCase();
        return (
          <span>
            <span className="bg-accent-soft rounded-lg px-3 py-1.5 text-accent text-xs font-semibold">
              {initials}
            </span>
            <span className="ml-2 capitalize">{org.company_name}</span>
          </span>
        );
      },
    },
    {
      key: "state",
      header: "State",
      className: "w-36 shrink-0",
      cell: (org: Organization) => org.state,
    },
    {
      key: "status",
      header: "Status",
      className: "w-24 shrink-0",
      cell: (org: Organization) => {
        const status = org.status;
        if (status === "active") {
          return (
            <Badge dot shape="tag">
              Active
            </Badge>
          );
        }
        if (status === "inactive") {
          return (
            <Badge dot variant="destructive" shape="tag">
              Inactive
            </Badge>
          );
        }
        return (
          <Badge dot variant="ghost" shape="tag">
            {status}
          </Badge>
        );
      },
    },
    {
      key: "added",
      header: "Added",
      className: "w-24 shrink-0 text-right text-muted",
      cell: (org: Organization) =>
        org.created_at ? format(new Date(org.created_at), "dd MMM") : "-",
    },
  ];

  // Quick actions items from dashboard sections
  const quickActionItems = DASHBOARD_SECTIONS.filter((section) =>
    section.permissionCodes.some((code) => hasPermission(code)),
  ).map((section) => ({
    icon: section.quickActionIcon,
    label: section.quickActionLabel,
    description: section.description,
    href: section.href,
  }));

  return (
    <div className="space-y-8 pb-4 md:pb-6">
      {/* Title zone */}
      <div className="flex gap-4 justify-between items-center p-4 md:p-6  ">
        <div>
          <h1 className="font-display text-[52px] font-extrabold leading-none tracking-[-0.03em] text-ink">
            {greeting}, {firstName}.
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your consultancy.
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center gap-2">
          <span className="font-body text-sm text-ink">Next payroll run</span>
          <span className="font-display text-[15px] font-bold text-copper">
            {format(startOfMonth(addMonths(today, 1)), "dd MMM")}
          </span>
          <span className="font-body text-xs text-muted">
            · {daysUntil} days
          </span>
        </div>
      </div>

      {/* Stats band */}
      <KpiBar items={kpiItems} isLoading={stats.isLoading} />

      {/* Content row */}
      <div
        data-testid="dashboard-content-row"
        className="flex gap-8 px-4 md:px-6"
      >
        {/* Recent orgs panel */}
        {hasPermission("org:list") && (
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
                Recently added
              </h2>
              <Button
                variant="link"
                size="sm"
                asChild
                className="h-auto gap-1 px-0"
              >
                <Link to="/organizations">
                  View all
                  <MoveRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
            {isOrgLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {orgColumns.map((col) => (
                      <TableHead key={col.key} className={col.className}>
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }, (_, i) => (
                    <TableRow key={i}>
                      {orgColumns.map((col) => (
                        <TableCell key={col.key} className={col.className}>
                          <div className="h-4 w-full animate-pulse bg-muted" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : orgs?.data && orgs.data.length === 0 ? (
              <EmptyState
                variant="no-data"
                title="No organizations yet"
                subTitle="Add your first organization to start running payroll."
                actions={
                  <Button size="sm" asChild>
                    <Link to="/organizations">Add your first organization</Link>
                  </Button>
                }
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {orgColumns.map((col) => (
                      <TableHead key={col.key} className={col.className}>
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgs?.data?.map((org) => (
                    <TableRow
                      key={org._id}
                      onClick={() => navigate(`/organizations/${org._id}`)}
                      className="cursor-pointer"
                    >
                      {orgColumns.map((col) => (
                        <TableCell key={col.key} className={col.className}>
                          {col.cell(org)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {/* Quick actions panel */}
        <div className="w-80">
          <QuickActions items={quickActionItems} />
        </div>
      </div>
    </div>
  );
}
