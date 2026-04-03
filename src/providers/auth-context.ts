import { createContext } from "react";
import type { ConsultancyUser } from "@/api/auth";

export interface AuthContextValue {
  user: ConsultancyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  setSession: (accessToken: string, user?: ConsultancyUser | null) => void;
  logout: () => void;
  /** Check if current user has the given permission code (consultancy RBAC). */
  hasPermission: (code: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
