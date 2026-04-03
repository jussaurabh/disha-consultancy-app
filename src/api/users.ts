import { apiClient } from "@/lib/api-client";

export interface ConsultancyUser {
  _id: string;
  email: string;
  /** Backend may return populated objects or just role IDs. */
  role_ids: ({ _id: string; name: string } | string)[];
  created_at: string;
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
  listUsers: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ListUsersResponse>("/api/consultancy/users", { params }),

  updateUserRole: (userId: string, role_id: string) =>
    apiClient.patch<ConsultancyUser>(`/api/consultancy/users/${userId}/role`, { role_id }),

  deleteUser: (userId: string) =>
    apiClient.delete(`/api/consultancy/users/${userId}`),
};
