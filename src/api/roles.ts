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
  consultancy_id?: string;
  created_at: string;
  updated_at: string;
}

export const rolesApi = {
  listRoles: () =>
    apiClient.get<Role[]>("/api/consultancy/roles"),

  getRole: (id: string) =>
    apiClient.get<Role>(`/api/consultancy/roles/${id}`),

  createRole: (body: { name: string; permission_ids: string[] }) =>
    apiClient.post<Role>("/api/consultancy/roles", body),

  updateRole: (id: string, body: { name?: string; permission_ids?: string[] }) =>
    apiClient.patch<Role>(`/api/consultancy/roles/${id}`, body),

  deleteRole: (id: string) =>
    apiClient.delete(`/api/consultancy/roles/${id}`),
};
