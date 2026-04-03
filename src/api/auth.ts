import { apiClient, publicApi } from "@/lib/api-client";

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    auth0_id: string;
  };
}

/** Consultancy login response includes roles and permission_codes. */
interface ConsultancyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: ConsultancyUser;
}

export interface RoleInfo {
  _id: string;
  name: string;
  permission_codes: string[];
}

export interface User {
  id: string;
  email: string;
  auth0_id: string;
}

/** Consultancy user: base user + consultancy_id, roles and permission_codes (from backend). */
export interface ConsultancyUser extends User {
  consultancy_id: string;
  roles?: RoleInfo[];
  permission_codes?: string[];
}

export interface ResetPasswordResponse {
  message: string;
  access_token?: string;
  user?: ConsultancyUser;
}

export const authApi = {
  signup: (email: string, password: string) =>
    apiClient.post<AuthResponse>("/auth/signup", { email, password }),

  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>("/auth/login", { email, password }),

  /** Consultancy app: login and get user with roles + permission_codes. */
  loginConsultancy: (email: string, password: string) =>
    apiClient.post<ConsultancyAuthResponse>("/auth/consultancy/login", {
      email,
      password,
    }),

  me: () => apiClient.get<User>("/auth/me"),

  /** Consultancy app: current user with roles + permission_codes. */
  meConsultancy: () =>
    apiClient.get<ConsultancyUser>("/api/consultancy/me"),
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
    publicApi.post<{ access_token: string; user: ConsultancyUser }>(
      "/auth/consultancy/invite/accept",
      { token, password }
    ),
};
