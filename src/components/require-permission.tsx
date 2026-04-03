import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/use-auth";

interface RequirePermissionProps {
  permissionCodes: string[];
  children: React.ReactNode;
}

/**
 * Renders children only if the user has at least one of the given permission codes.
 * Otherwise redirects to /dashboard.
 */
export function RequirePermission({ permissionCodes, children }: RequirePermissionProps) {
  const { hasPermission } = useAuth();
  const location = useLocation();

  const hasAny = permissionCodes.some((code) => hasPermission(code));
  if (!hasAny) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
