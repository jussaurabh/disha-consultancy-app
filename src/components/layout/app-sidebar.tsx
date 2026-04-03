import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SIDEBAR_NAV } from "@/config/dashboard-sections";
import { useAuth } from "@/providers/use-auth";

function getInitials(email: string): string {
  const part = email.split("@")[0];
  if (part.length >= 2) return part.slice(0, 2).toUpperCase();
  return part.slice(0, 1).toUpperCase();
}

export function AppSidebar() {
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  const email = user?.email ?? "";
  const initials = email ? getInitials(email) : "?";

  const visibleNavItems = SIDEBAR_NAV.filter((item) => {
    if (item.permissionCodes === null) return true;
    return item.permissionCodes.some((code) => hasPermission(code));
  });

  return (
    <Sidebar>
      {/* Logo + brand badge */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-sidebar-foreground">
            Disha Payroll
          </span>
          <Badge
            className="rounded-full px-2 py-0 text-[10px] font-medium uppercase tracking-widest"
            style={{ backgroundColor: "#EE3338", color: "#fff", border: "none" }}
          >
            Consultancy
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
            Platform
          </SidebarGroupLabel>
          <SidebarMenu>
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link
                      to={item.href}
                      className={
                        isActive
                          ? "border-l-2 border-[#EE3338] pl-[calc(var(--spacing)*3-2px)]"
                          : "border-l-2 border-transparent"
                      }
                    >
                      <Icon
                        className="size-4"
                        style={{ color: isActive ? "#FAFAFA" : "#A1A1AA" }}
                      />
                      <span
                        style={{ color: isActive ? "#FAFAFA" : "#A1A1AA" }}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User identity at bottom */}
      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="size-7 shrink-0">
            <AvatarFallback
              className="text-xs font-medium text-white"
              style={{ backgroundColor: "#EE3338" }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-sidebar-foreground">
              {email}
            </p>
            <p className="text-[10px] text-sidebar-foreground/50">Consultancy</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
