import { apiClient } from "@/lib/api-client";

export interface Invite {
  _id: string;
  email: string;
  role_id: { _id: string; name: string };
  invited_by: { _id: string; email: string };
  status: "pending" | "accepted" | "cancelled";
  expires_at: string;
  created_at: string;
}

export const invitesApi = {
  createInvite: (body: { email: string; role_id: string }) =>
    apiClient.post<Invite>("/api/consultancy/invites", body),

  listInvites: () =>
    apiClient.get<Invite[]>("/api/consultancy/invites"),

  cancelInvite: (id: string) =>
    apiClient.delete(`/api/consultancy/invites/${id}`),

  /** Resend a cancelled invite by creating a new invite with same email/role (backend has no dedicated resend endpoint). */
  resendInvite: (invite: Invite) =>
    apiClient.post<Invite>("/api/consultancy/invites", {
      email: invite.email,
      role_id: typeof invite.role_id === "object" ? invite.role_id._id : invite.role_id,
    }),
};
