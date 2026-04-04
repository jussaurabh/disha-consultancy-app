import { apiClient } from "@/lib/api-client";

export interface Permission {
  _id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  is_system?: boolean;
}

export const permissionsApi = {
  listPermissions: () =>
    apiClient.get<Permission[]>("/api/consultancy/permissions"),

  createPermission: (body: { code: string; name: string; description?: string; category?: string }) =>
    apiClient.post<Permission>("/api/consultancy/permissions", body),

  updatePermission: (id: string, body: { code?: string; name?: string; description?: string; category?: string }) =>
    apiClient.patch<Permission>(`/api/consultancy/permissions/${id}`, body),

  deletePermission: (id: string) =>
    apiClient.delete(`/api/consultancy/permissions/${id}`),
};
