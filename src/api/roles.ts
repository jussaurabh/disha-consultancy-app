import { apiClient } from "@/lib/api-client";

export interface PermissionInRole {
  _id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  is_system: boolean;
}

export interface Role {
  _id: string;
  name: string;
  permissions: PermissionInRole[];
  is_system?: boolean;
  scope?: string;
  scope_id?: string | null;
  created_at: string;
  updated_at: string;
}

export const rolesApi = {
  listRoles: () =>
    apiClient.get<Role[]>("/api/roles"),

  getRole: (id: string) =>
    apiClient.get<Role>(`/api/roles/${id}`),

  createRole: (body: { name: string; permission_ids: string[] }) =>
    apiClient.post<Role>("/api/roles", body),

  updateRole: (id: string, body: { name?: string; permission_ids?: string[] }) =>
    apiClient.patch<Role>(`/api/roles/${id}`, body),

  deleteRole: (id: string) =>
    apiClient.delete(`/api/roles/${id}`),
};