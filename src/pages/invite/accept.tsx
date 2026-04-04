import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { inviteAuthApi } from "@/api/auth";
import { useAuth } from "@/providers/use-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

type VerifyState =
  | { status: "loading" }
  | { status: "invalid"; title: string; message: string }
  | { status: "ready"; email: string; role: { _id: string; name: string } };

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const token = searchParams.get("token") ?? "";

  const [verifyState, setVerifyState] = useState<VerifyState>({ status: "loading" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifyState({
        status: "invalid",
        title: "Invite link invalid",
        message: "Invalid or missing invite link.",
      });
      return;
    }
    inviteAuthApi
      .verifyInvite(token)
      .then((res) => {
        setVerifyState({
          status: "ready",
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch((err: { response?: { data?: { message?: string; code?: string } } }) => {
        const code = err.response?.data?.code ?? err.response?.data?.message;
        if (code === "cancelled" || (typeof code === "string" && code.toLowerCase().includes("cancelled"))) {
          setVerifyState({
            status: "invalid",
            title: "Invite cancelled",
            message: "This invite has been cancelled. Please contact your administrator.",
          });
        } else if (code === "accepted" || (typeof code === "string" && code.toLowerCase().includes("accepted"))) {
          setVerifyState({
            status: "invalid",
            title: "Invite already used",
            message: "This invite has already been used.",
          });
        } else if (code === "expired" || (typeof code === "string" && code.toLowerCase().includes("expired"))) {
          setVerifyState({
            status: "invalid",
            title: "Invite expired",
            message: "This invite link has expired. Please ask your administrator to resend the invite.",
          });
        } else {
          setVerifyState({
            status: "invalid",
            title: "Invite link invalid",
            message: "Invalid invite link.",
          });
        }
      });
  }, [token]);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const acceptMutation = useMutation({
    mutationFn: ({ password }: PasswordValues) => inviteAuthApi.acceptInvite(token, password),
    onSuccess: (res) => {
      setSession(res.data.access_token, res.data.user);
      navigate("/dashboard", { replace: true });
    },
  });

  const passwordValue = form.watch("password");

  if (verifyState.status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (verifyState.status === "invalid") {
    return (
      <AuthShell>
        <div className="space-y-6">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="size-5 text-red-600" />
          </div>

          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-zinc-950">{verifyState.title}</h1>
            <p className="text-sm text-muted-foreground">{verifyState.message}</p>
          </header>

          <p className="text-sm text-muted-foreground">Contact your administrator for a new invite.</p>
        </div>
      </AuthShell>
    );
  }

  const { email, role } = verifyState;

  return (
    <AuthShell>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-950">Welcome to Disha</h1>
          <p className="text-sm text-muted-foreground">
            You&apos;ve been invited to join as <span className="font-semibold text-zinc-900">{role.name}</span>
          </p>
        </header>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Email</label>
          <div className="rounded-md border border-zinc-200 bg-white px-3 py-3 text-base font-medium text-zinc-900">{email}</div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => acceptMutation.mutate(v))}
            className={`grid gap-4 ${acceptMutation.isPending ? "opacity-90" : ""}`}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                        autoFocus
                        disabled={acceptMutation.isPending}
                        style={{ color: "#09090B" }}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        disabled={acceptMutation.isPending}
                      >
                        {showPassword ? <EyeOff className="size-4 text-muted-foreground" /> : <Eye className="size-4 text-muted-foreground" />}
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
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                        disabled={acceptMutation.isPending}
                        style={{ color: "#09090B" }}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        disabled={acceptMutation.isPending}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4 text-muted-foreground" /> : <Eye className="size-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {acceptMutation.isError && (
              <p role="alert" aria-live="polite" className="text-[13px] text-destructive">
                {(acceptMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                  "Something went wrong. Please try again."}
              </p>
            )}

            <Button type="submit" className="h-10 w-full bg-[#EE3338] text-white hover:bg-[#D42D31]" disabled={acceptMutation.isPending}>
              {acceptMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {acceptMutation.isPending ? "Setting password..." : "Set password & sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthShell>
  );
}
