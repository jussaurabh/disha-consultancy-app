import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { KpiBar } from "@/components/ui/kpi-bar";
import { QuickActions } from "@/components/ui/quick-actions";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
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

  const { data: orgs } = useQuery({
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

  // Recent orgs columns
  const orgColumns: DataTableColumn<Organization>[] = [
    {
      key: "initials",
      header: "Company",
      className: "min-w-0 truncate",
      cell: (org) => {
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
      cell: (org) => org.state,
    },
    {
      key: "status",
      header: "Status",
      className: "w-24 shrink-0",
      cell: (org) => {
        const status = org.status;
        if (status === "active") {
          return (
            <span className="bg-accent text-xs font-bold text-accent-foreground rounded px-2">
              Active
            </span>
          );
        }
        if (status === "inactive") {
          return (
            <span className="bg-muted text-xs font-bold text-muted-foreground rounded px-2">
              Inactive
            </span>
          );
        }
        return (
          <span className="bg-muted text-xs font-bold text-muted-foreground rounded px-2">
            {status}
          </span>
        );
      },
    },
    {
      key: "added",
      header: "Added",
      className: "w-24 shrink-0 text-right text-muted",
      cell: (org) =>
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
      <div data-testid="dashboard-content-row" className="flex gap-8 px-4 md:px-6">
        {/* Recent orgs panel */}
        {hasPermission("org:list") && (
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
                Recently added
              </h2>
              <Link
                to="/organizations"
                className="font-body text-[13px] font-semibold text-accent"
              >
                View all →
              </Link>
            </div>
            <DataTable
              columns={orgColumns}
              rows={orgs?.data ?? []}
              rowKey={(org) => org._id}
              onRowClick={(org) => navigate(`/organizations/${org._id}`)}
              emptyState={
                <div className="py-8 text-center">
                  <p className="font-body text-sm text-muted">
                    No organizations yet
                  </p>
                  <Link
                    to="/organizations"
                    className="font-body text-sm font-semibold text-accent"
                  >
                    Add your first organization
                  </Link>
                </div>
              }
            />
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
