import { apiClient } from "@/lib/api-client";

export interface Role {
  _id: string;
  name: string;
  permission_codes: string[];
  created_at: string;
  is_system?: boolean;
}

export const rolesApi = {
  listRoles: () =>
    apiClient.get<Role[]>("/api/consultancy/roles"),

  getRole: (id: string) =>
    apiClient.get<Role>(`/api/consultancy/roles/${id}`),

  createRole: (body: { name: string; permission_codes: string[] }) =>
    apiClient.post<Role>("/api/consultancy/roles", body),

  updateRole: (id: string, body: { name?: string; permission_codes?: string[] }) =>
    apiClient.patch<Role>(`/api/consultancy/roles/${id}`, body),

  deleteRole: (id: string) =>
    apiClient.delete(`/api/consultancy/roles/${id}`),
};
