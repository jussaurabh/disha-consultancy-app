import { apiClient, publicApi } from "@/lib/api-client";

export type UserScope = "superadmin" | "consultant" | "org";

export interface RoleInfo {
  _id: string;
  name: string;
  permission_codes: string[];
}

export interface LoginUser {
  id: string;
  email: string;
  clerk_id: string;
  scope: UserScope;
  scope_id: string | null;
  roles: RoleInfo[];
  permission_codes: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: LoginUser;
}

export interface SignupResponse {
  clerk_id: string;
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
  access_token?: string;
  user?: LoginUser;
}

export const authApi = {
  signup: (email: string, password: string) =>
    apiClient.post<SignupResponse>("/auth/signup", { email, password }),

  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login", { email, password }),

  me: () => apiClient.get<LoginUser>("/auth/me"),

  /** Consultancy app: current user with roles + permission_codes. */
  meConsultancy: () =>
    apiClient.get<LoginUser>("/api/consultancy/me"),
};

/** Public – no auth header. Forgot/reset password. */
export const passwordResetApi = {
  forgotPassword: (email: string) =>
    publicApi.post<{ message: string }>("/auth/forgot-password", { email }),

  validateResetToken: (token: string) =>
    publicApi.post<{ valid: boolean }>("/auth/reset-password/validate", { token }),

  resetPassword: (token: string, new_password: string) =>
    publicApi.post<ResetPasswordResponse>("/auth/reset-password", { token, new_password }),
};

/** Public – no auth header. Invite verify and accept. */
export const inviteAuthApi = {
  verifyInvite: (token: string) =>
    publicApi.post<{ email: string; role: { _id: string; name: string } }>(
      "/auth/consultancy/invite/verify",
      { token }
    ),

  acceptInvite: (token: string, password: string) =>
    publicApi.post<{ access_token: string; user: LoginUser }>(
      "/auth/consultancy/invite/accept",
      { token, password }
    ),
};