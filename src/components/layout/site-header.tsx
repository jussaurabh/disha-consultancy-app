import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/use-auth";

function getInitials(email: string): string {
  const part = email.split("@")[0];
  if (part.length >= 2) return part.slice(0, 2).toUpperCase();
  return part.slice(0, 1).toUpperCase();
}

/** Map route path → readable page title for breadcrumb */
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/organizations": "Organizations",
  "/organizations/new": "Create Organization",
  "/users": "Users",
  "/roles": "Roles",
  "/permissions": "Permissions",
};

export function SiteHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const email = user?.email ?? "";
  const initials = email ? getInitials(email) : "?";

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-card px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="h-4" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Disha Payroll</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{pageTitle}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md p-1 text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open user menu"
            >
              <Avatar className="size-7">
                <AvatarFallback className="text-xs font-medium text-white" style={{ backgroundColor: "#EE3338" }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[180px] truncate text-sm text-foreground sm:inline">{email}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col gap-1 px-2 py-1.5 text-sm">
              <span className="font-medium">{email}</span>
              <span className="text-muted-foreground">Consultancy</span>
            </div>
            <Separator />
            <DropdownMenuItem onClick={logout} variant="destructive">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
