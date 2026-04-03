import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, type ConsultancyUser } from "@/api/auth";
import { AuthContext } from "./auth-context";

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.meConsultancy().then((r) => r.data),
    enabled: hasToken,
    retry: false,
  });

  const setSession = useCallback(
    (accessToken: string, user?: ConsultancyUser | null) => {
      localStorage.setItem(TOKEN_KEY, accessToken);

      if (user) {
        queryClient.setQueryData<ConsultancyUser>(["me"], user);
      } else {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }

      setHasToken(true);
    },
    [queryClient]
  );

  const login = async (email: string, password: string) => {
    const res = await authApi.loginConsultancy(email, password);
    setSession(res.data.access_token, res.data.user);
  };

  const signup = async (email: string, password: string) => {
    const res = await authApi.signup(email, password);
    setSession(res.data.access_token);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    queryClient.removeQueries({ queryKey: ["me"] });
    setHasToken(false);
    navigate("/login");
  };

  const hasPermission = useCallback(
    (code: string) => {
      const codes = meQuery.data?.permission_codes;
      return Array.isArray(codes) && codes.includes(code);
    },
    [meQuery.data?.permission_codes],
  );

  return (
    <AuthContext.Provider
      value={{
        user: meQuery.data ?? null,
        isAuthenticated: !!meQuery.data,
        // isLoading = isPending && isFetching: true only while actively fetching,
        // false when disabled (no token) or after fetch completes.
        isLoading: meQuery.isLoading,
        login,
        signup,
        setSession,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
