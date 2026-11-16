import { createContext } from "react";
import type { LoginUser } from "@/api/auth";

export interface AuthContextValue {
  user: LoginUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  setSession: (accessToken: string, user?: LoginUser | null) => void;
  logout: () => void;
  /** Check if current user has the given permission code (consultancy RBAC). */
  hasPermission: (code: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);