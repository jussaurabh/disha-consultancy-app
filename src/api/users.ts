import { apiClient } from "@/lib/api-client";

export interface ConsultancyUser {
  _id: string;
  email: string;
  /** Backend may return populated objects or just role IDs. */
  role_ids: ({ _id: string; name: string } | string)[];
  created_at: string;
  updated_at?: string;
  is_archived?: boolean;
}

/** Backend returns paginated list like orgs. */
export interface ListUsersResponse {
  data: ConsultancyUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const usersApi = {
  listUsers: (params?: { page?: number; limit?: number; org_id?: string }) =>
    apiClient.get<ListUsersResponse>("/api/users", { params }),

  updateUserRole: (userId: string, role_id: string) =>
    apiClient.patch<ConsultancyUser>(`/api/users/${userId}/role`, { role_id }),

  deleteUser: (userId: string) =>
    apiClient.delete(`/api/users/${userId}`),

  archiveUser: (userId: string) =>
    apiClient.patch<ConsultancyUser>(`/api/users/${userId}/archive`, {}),

  unarchiveUser: (userId: string) =>
    apiClient.patch<ConsultancyUser>(`/api/users/${userId}/unarchive`, {}),
};