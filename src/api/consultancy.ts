import { apiClient } from "@/lib/api-client";

export interface ConsultancyStats {
  orgs: number;
  users: number;
  roles: number;
}

export const consultancyApi = {
  getStats: () =>
    apiClient.get<ConsultancyStats>("/api/consultancy/stats"),
};
