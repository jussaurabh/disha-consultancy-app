import type { LucideIcon } from "lucide-react";
import { Building2, KeyRound, LayoutDashboard, Plus, Shield, UserPlus, Users } from "lucide-react";
import type { ConsultancyStats } from "@/api/consultancy";

export interface DashboardSectionConfig {
  title: string;
  description: string;
  href: string;
  permissionCodes: string[];
  icon: LucideIcon;
  statsKey: keyof ConsultancyStats;
  actionLabel: string;
  /** Label shown on the Quick Actions button */
  quickActionLabel: string;
  /** Icon shown on the Quick Actions button */
  quickActionIcon: LucideIcon;
}

/** Sections shown on dashboard and in sidebar. Permission-gated: show if user has any of permissionCodes. */
export const DASHBOARD_SECTIONS: DashboardSectionConfig[] = [
  {
    title: "Organizations",
    description: "View and manage client organizations.",
    href: "/organizations",
    permissionCodes: ["org:list", "org:read", "org:create", "org:update", "org:delete"],
    icon: Building2,
    statsKey: "orgs",
    actionLabel: "View organizations",
    quickActionLabel: "Add Organization",
    quickActionIcon: Plus,
  },
  {
    title: "Users",
    description: "Invite and manage consultancy users and their roles.",
    href: "/users",
    permissionCodes: ["consultancy_user:list"],
    icon: Users,
    statsKey: "users",
    actionLabel: "Manage users",
    quickActionLabel: "Invite User",
    quickActionIcon: UserPlus,
  },
  {
    title: "Roles",
    description: "View and edit roles and their permissions.",
    href: "/roles",
    permissionCodes: ["role:read"],
    icon: Shield,
    statsKey: "roles",
    actionLabel: "View roles",
    quickActionLabel: "Create Role",
    quickActionIcon: Plus,
  },
  {
    title: "Permissions",
    description: "View available permission codes.",
    href: "/permissions",
    permissionCodes: ["permission:list"],
    icon: KeyRound,
    statsKey: "roles", // Placeholder - permissions don't have a stats count
    actionLabel: "View permissions",
    quickActionLabel: "View Permissions",
    quickActionIcon: KeyRound,
  },
];

/** Nav item for sidebar: Dashboard is shown to all authenticated; others use same config as section. */
export const SIDEBAR_NAV = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permissionCodes: null as string[] | null, // null = show to all authenticated
  },
  ...DASHBOARD_SECTIONS.map((s) => ({
    title: s.title,
    href: s.href,
    icon: s.icon,
    permissionCodes: s.permissionCodes,
  })),
];
