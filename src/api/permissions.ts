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
};
