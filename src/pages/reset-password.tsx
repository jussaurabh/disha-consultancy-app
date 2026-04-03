import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { passwordResetApi } from "@/api/auth";
import { useAuth } from "@/providers/use-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

type TokenState =
  | { status: "loading" }
  | { status: "invalid"; title: string; message: string }
  | { status: "ready" };

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const token = searchParams.get("token") ?? "";

  const [tokenState, setTokenState] = useState<TokenState>({ status: "loading" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenState({
        status: "invalid",
        title: "Reset link invalid",
        message: "Invalid or missing reset link.",
      });
      return;
    }
    passwordResetApi
      .validateResetToken(token)
      .then(() => setTokenState({ status: "ready" }))
      .catch(() =>
        setTokenState({
          status: "invalid",
          title: "Reset link expired",
          message: "This reset link is invalid or has expired. Please request a new one.",
        })
      );
  }, [token]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: ({ password }: FormValues) =>
      passwordResetApi.resetPassword(token, password),
    onSuccess: (res) => {
      if (res.data.access_token) {
        setSession(res.data.access_token, res.data.user);
        navigate("/dashboard", { replace: true });
        return;
      }

      navigate("/login", { replace: true });
    },
  });

  const passwordValue = form.watch("password");

  if (tokenState.status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (tokenState.status === "invalid") {
    return (
      <AuthShell>
        <div className="space-y-6">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="size-5 text-red-600" />
          </div>

          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-zinc-950">{tokenState.title}</h1>
            <p className="text-sm text-muted-foreground">{tokenState.message}</p>
          </header>

          <div className="space-y-3">
            <Link
              to="/forgot-password"
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE3338] focus-visible:ring-offset-2"
            >
              Request a new reset link
            </Link>

            <Link
              to="/login"
              className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE3338] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="space-y-8">
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE3338] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4" />
          Back to login
        </Link>

        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-950">Set a new password</h1>
          <p className="text-sm text-muted-foreground">Choose a strong password for your account.</p>
        </header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className={`grid gap-4 ${mutation.isPending ? "opacity-90" : ""}`}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                        autoFocus
                        disabled={mutation.isPending}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        disabled={mutation.isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4 text-muted-foreground" />
                        ) : (
                          <Eye className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <PasswordStrengthIndicator password={passwordValue} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" disabled={mutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.isError && (
              <p role="alert" aria-live="polite" className="text-[13px] text-destructive">
                {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                  "Something went wrong. Please try again."}
              </p>
            )}

            <Button
              type="submit"
              className="h-10 w-full bg-[#EE3338] text-white hover:bg-[#D42D31]"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mutation.isPending ? "Resetting password..." : "Reset password"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthShell>
  );
}
