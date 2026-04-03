import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { passwordResetApi } from "@/api/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: ({ email }: FormValues) => passwordResetApi.forgotPassword(email),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <AuthShell>
        <div className="space-y-6">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-zinc-100">
            <Mail className="size-5 text-zinc-600" />
          </div>

          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-zinc-950">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              If that email exists in our system, a password reset link has been sent.
            </p>
          </header>

          <p className="text-[13px] text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder or try again.
          </p>

          <Link
            to="/login"
            className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE3338] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
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
          <h1 className="text-2xl font-semibold text-zinc-950">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground">
            No worries. Enter your email and we&apos;ll send you a reset link.
          </p>
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

            {mutation.isError && (
              <p role="alert" aria-live="polite" className="text-[13px] text-destructive">
                Something went wrong. Please try again.
              </p>
            )}

            <Button
              type="submit"
              className="h-10 w-full bg-[#EE3338] text-white hover:bg-[#D42D31]"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mutation.isPending ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthShell>
  );
}
