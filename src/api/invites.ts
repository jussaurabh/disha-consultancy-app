import { apiClient } from "@/lib/api-client";

export interface Invite {
  _id: string;
  invite_type: "superadmin_user" | "consultancy_user" | "org_user";
  scope: "superadmin" | "consultant" | "org";
  scope_id: string | null;
  email: string;
  role_id: { _id: string; name: string };
  invited_by: { _id: string; email: string };
  status: "pending" | "accepted" | "cancelled";
  expires_at: string;
  created_at: string;
}

export const invitesApi = {
  createInvite: (
    body:
      | { invite_type: "consultancy_user"; email: string; role_id: string }
      | { invite_type: "org_user"; email: string; scope_id: string; role_id?: string },
  ) => apiClient.post<Invite>("/api/invites", body),

  listInvites: (params?: { invite_type?: "org_user"; scope_id?: string }) =>
    apiClient.get<Invite[]>("/api/invites", { params }),

  cancelInvite: (id: string) =>
    apiClient.delete(`/api/invites/${id}`),

  resendInvite: (id: string) =>
    apiClient.post(`/api/invites/${id}/resend`),
};