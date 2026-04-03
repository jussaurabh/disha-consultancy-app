import { apiClient } from "@/lib/api-client";

export interface Organization {
  _id: string;
  company_name: string;
  state: string;
  status?: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrgBody {
  company_name: string;
  state: string;
}

export interface UpdateOrgBody {
  company_name?: string;
  state?: string;
  status?: "active" | "inactive";
}

export interface ListOrgsResponse {
  data: Organization[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const orgsApi = {
  createOrg: (body: CreateOrgBody) =>
    apiClient.post<Organization>("/api/consultancy/orgs", body),

  listOrgs: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ListOrgsResponse>("/api/consultancy/orgs", { params }),

  getOrg: (id: string) =>
    apiClient.get<Organization>(`/api/consultancy/orgs/${id}`),

  updateOrg: (id: string, body: UpdateOrgBody) =>
    apiClient.patch<Organization>(`/api/consultancy/orgs/${id}`, body),

  deleteOrg: (id: string) =>
    apiClient.delete<{ deleted: true }>(`/api/consultancy/orgs/${id}`),
};
