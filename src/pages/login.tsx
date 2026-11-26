import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

/**
 * Login — Paper "dc" board "00 / Login" (9AX-1).
 * Split screen: surface form panel · copper-soft illustration panel.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [keepSignedIn, setKeepSignedIn] = useState(true);
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
    const status = (mutation.error as { response?: { status?: number } })
      ?.response?.status;
    if (status === 403)
      return "Not authorized for consultancy. Contact an administrator.";
    return "Invalid email or password. Please try again.";
  })();

  return (
    <div className="flex min-h-dvh bg-surface font-body text-ink">
      {/* Left — account form */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-24 sm:px-10 lg:w-1/2 lg:px-12">
        <div className="absolute left-6 top-6 flex items-center gap-2.5 lg:left-12 lg:top-10">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent">
            <Check aria-hidden className="size-3.5 text-primary-foreground" strokeWidth={2} />
          </div>
          <span className="font-display text-lg font-bold leading-tight">Disha</span>
          <Badge
            variant="copper"
            className="h-5 px-2 text-[10px] font-bold leading-snug tracking-[0.08em] uppercase"
          >
            Consultancy
          </Badge>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="flex w-full max-w-[400px] flex-col gap-9"
          >
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase leading-tight tracking-[0.12em] text-copper">
                Consultant workspace
              </p>
              <h1 className="font-display text-[44px] font-extrabold leading-none tracking-[-0.01em]">
                Welcome back.
              </h1>
              <p className="text-sm leading-5 text-muted-foreground">
                Sign in to run payroll, PF and ESI for your client organizations.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className="text-[13px] font-semibold leading-4">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="arjun@dishaconsultancy.in"
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
                  <FormItem className="gap-1.5">
                    <FormLabel className="text-[13px] font-semibold leading-4">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="pr-14"
                          disabled={mutation.isPending}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-[13px] font-semibold leading-snug text-accent hover:text-accent-hover"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <label
                  htmlFor="keep-signed-in"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    id="keep-signed-in"
                    checked={keepSignedIn}
                    onCheckedChange={(v) => setKeepSignedIn(v === true)}
                    className="size-4 rounded-[4px] [&_svg]:size-2.5"
                  />
                  <span className="text-[13px] leading-snug">Keep me signed in</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[13px] font-semibold leading-snug text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {loginError && (
                <p role="alert" aria-live="polite" className="text-[13px] leading-snug text-destructive">
                  {loginError}
                </p>
              )}
              <Button
                type="submit"
                loading={mutation.isPending}
                className="h-10.5 w-full gap-2.5"
              >
                Sign in
                <ArrowRight aria-hidden className="size-3.5" />
              </Button>
            </div>
          </form>
        </Form>

        <div className="absolute bottom-6 left-6 flex items-center gap-1.5 lg:bottom-10 lg:left-12">
          <span className="text-[13px] leading-snug text-muted-foreground">
            New consultancy?
          </span>
          <a
            href="mailto:contact@disha-consultancy.in"
            className="text-[13px] font-semibold leading-snug text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Request access
          </a>
        </div>
      </div>

      {/* Right — illustration panel */}
      <div className="relative hidden w-1/2 items-center justify-center bg-copper-soft lg:flex">
        <svg
          viewBox="0 0 200 150"
          width={420}
          height={315}
          role="img"
          aria-label="Consultant raising an ID badge"
          className="-mt-10 h-auto w-full max-w-[420px] shrink-0"
        >
          <circle cx="100" cy="72" r="56" fill="var(--color-accent-soft)" />
          <circle
            cx="164"
            cy="30"
            r="16"
            fill="none"
            stroke="var(--color-copper)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="0.5 6"
            opacity={0.7}
          />
          <ellipse cx="100" cy="137" rx="56" ry="6" fill="var(--color-accent-soft)" />
          <g>
            <path d="M44 132 V114" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 120 Q36 117 35 108 Q43 111 44 120 Z" fill="var(--color-accent)" />
            <path d="M44 114 Q50 107 53 101 Q45 105 44 114 Z" fill="var(--color-accent)" opacity={0.85} />
          </g>
          <g>
            <rect x="92" y="88" width="8" height="40" rx="4" fill="var(--color-ink)" />
            <rect x="102" y="88" width="8" height="40" rx="4" fill="var(--color-ink)" />
            <rect x="89" y="126" width="14" height="6" rx="3" fill="var(--color-copper)" />
            <rect x="101" y="126" width="14" height="6" rx="3" fill="var(--color-copper)" />
            <rect x="86" y="46" width="28" height="44" rx="12" fill="var(--color-accent)" />
            <rect x="97" y="40" width="6" height="8" fill="#C08552" />
            <circle cx="100" cy="31" r="11" fill="#C08552" />
            <path d="M 89 31 a 11 11 0 0 1 22 0 h -4 a 7 7 0 0 0 -14 0 z" fill="var(--color-ink)" />
            <rect x="84" y="52" width="8" height="26" rx="4" transform="rotate(20 88 54)" fill="var(--color-accent)" />
            <circle cx="79" cy="79" r="4.5" fill="#C08552" />
            <path d="M101 44 Q114 36 131 40" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="108" y="52" width="8" height="26" rx="4" transform="rotate(-55 112 54)" fill="var(--color-accent)" />
            <rect x="121" y="40" width="26" height="34" rx="3" fill="var(--color-accent)" />
            <rect x="130" y="36" width="8" height="7" rx="2" fill="var(--color-copper)" />
            <circle cx="129" cy="51" r="4" fill="var(--color-copper-soft)" />
            <rect x="125" y="58" width="18" height="3" rx="1.5" fill="var(--color-copper-soft)" />
            <rect x="125" y="64" width="12" height="3" rx="1.5" fill="var(--color-copper-soft)" opacity={0.7} />
            <circle cx="134" cy="73" r="4.5" fill="#C08552" />
          </g>
          <circle cx="44" cy="98" r="2.5" fill="var(--color-accent)" opacity={0.8} />
          <circle cx="168" cy="88" r="3" fill="var(--color-copper)" opacity={0.8} />
        </svg>
        <div className="absolute inset-x-0 bottom-18 flex flex-col items-center gap-1.5 px-6 text-center">
          <p className="font-display text-lg font-bold leading-snug">
            One workspace for every client organization.
          </p>
          <p className="text-xs leading-snug tracking-[0.04em] text-muted-foreground">
            Payroll · PF · ESI for Indian consultancies
          </p>
        </div>
      </div>
    </div>
  );
}
