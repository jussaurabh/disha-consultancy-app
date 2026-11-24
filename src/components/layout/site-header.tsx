import { useLocation } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { SIDEBAR_NAV } from "@/config/dashboard-sections";
import { useAuth } from "@/providers/use-auth";

export function SiteHeader() {
  const { user, hasPermission, logout } = useAuth();
  const location = useLocation();
  const email = user?.email ?? "";

  const navItems = SIDEBAR_NAV.filter((item) => {
    if (item.permissionCodes === null) return true;
    return item.permissionCodes.some((code) => hasPermission(code));
  });

  return (
    <Header>
      <Header.Brand />
      <Header.Nav>
        {navItems.map((item) => (
          <Header.NavItem
            key={item.href}
            to={item.href}
            isActive={location.pathname.startsWith(item.href)}
          >
            {item.title}
          </Header.NavItem>
        ))}
      </Header.Nav>
      <Header.Actions>
        <Header.User
          email={email || undefined}
          subtitle="Consultancy"
          onLogout={logout}
        />
      </Header.Actions>
    </Header>
  );
}
