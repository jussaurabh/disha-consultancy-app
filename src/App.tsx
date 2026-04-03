import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/protected-route";
import { RequirePermission } from "@/components/require-permission";
import { AppShell } from "@/components/layout/app-shell";

import LoginPage from "@/pages/login";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import AcceptInvitePage from "@/pages/invite/accept";
import DashboardPage from "@/pages/dashboard";
import OrganizationsPage from "@/pages/organizations/index";
import NewOrganizationPage from "@/pages/organizations/new";
import OrganizationDetailPage from "@/pages/organizations/detail";
import UsersPage from "@/pages/users/index";
import RolesPage from "@/pages/roles/index";
import PermissionsPage from "@/pages/permissions/index";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/invite/accept" element={<AcceptInvitePage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route
            path="/organizations"
            element={
              <RequirePermission permissionCodes={["org:list"]}>
                <OrganizationsPage />
              </RequirePermission>
            }
          />

          <Route
            path="/organizations/new"
            element={
              <RequirePermission permissionCodes={["org:create"]}>
                <NewOrganizationPage />
              </RequirePermission>
            }
          />

          <Route
            path="/organizations/:id"
            element={
              <RequirePermission permissionCodes={["org:read"]}>
                <OrganizationDetailPage />
              </RequirePermission>
            }
          />

          <Route
            path="/users"
            element={
              <RequirePermission permissionCodes={["consultancy_user:list"]}>
                <UsersPage />
              </RequirePermission>
            }
          />

          <Route
            path="/roles"
            element={
              <RequirePermission permissionCodes={["role:read"]}>
                <RolesPage />
              </RequirePermission>
            }
          />

          <Route
            path="/permissions"
            element={
              <RequirePermission permissionCodes={["permission:list"]}>
                <PermissionsPage />
              </RequirePermission>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
