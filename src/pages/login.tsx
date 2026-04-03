import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/use-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginValues) => login(email, password),
    onSuccess: () => navigate("/dashboard"),
  });

  const loginError = (() => {
    if (!mutation.isError) return null;
    const status = (mutation.error as { response?: { status?: number } })?.response?.status;
    if (status === 403) return "Not authorized for consultancy. Contact an administrator.";
    return "Invalid email or password. Please try again.";
  })();

  return (
    <AuthShell>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-950">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to Disha Payroll Consultancy</p>
        </header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className={`grid gap-4 ${mutation.isPending ? "opacity-90" : ""}`}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoFocus
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                </FormItem>
              )}
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE3338] focus-visible:ring-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            {loginError && (
              <p role="alert" aria-live="polite" className="text-[13px] text-destructive">
                {loginError}
              </p>
            )}

            <Button
              type="submit"
              className="h-10 w-full bg-[#EE3338] text-white hover:bg-[#D42D31]"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mutation.isPending ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Form>

        <p className="text-[13px] text-muted-foreground">
          Access is by invite only. Contact your consultancy administrator.
        </p>
      </div>
    </AuthShell>
  );
}
