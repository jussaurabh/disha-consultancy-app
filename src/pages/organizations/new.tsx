import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { orgsApi, type Organization } from "@/api/orgs";
import { STATES_OPTIONS } from "@/lib/org-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  state: z.string().min(1, "State is required"),
});

type FormValues = z.infer<typeof schema>;
type ApiError = { response?: { data?: { message?: string } } };

export default function NewOrganizationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createdOrg, setCreatedOrg] = useState<Organization | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { company_name: "", state: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      orgsApi.createOrg(values).then((r) => r.data),
    onSuccess: (org) => {
      queryClient.invalidateQueries({
        queryKey: ["orgs"],
      });
      setCreatedOrg(org);
      form.reset();
      toast.success(`Organization created. Generated CNO: ${org.cno}`);
    },
  });

  useEffect(() => {
    if (!createdOrg) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate(`/organizations/${createdOrg._id}`);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [createdOrg, navigate]);

  return (
    <div className="space-y-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/organizations")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Organization</h1>
          <p className="text-muted-foreground mt-2">
            {createdOrg
              ? "The organization has been created successfully. Save the generated CNO for future reference."
              : "Add a new client organization."}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Organization Form</CardTitle>
        </CardHeader>
        <CardContent>
          {createdOrg ? (
            <div
              aria-live="polite"
              className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-emerald-900">
                    Organization created
                  </h2>
                  <p className="text-sm text-emerald-800">
                    {createdOrg.company_name} is ready. Your generated CNO is
                    shown below.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="generated-cno"
                  className="text-sm font-medium text-emerald-950"
                >
                  Generated CNO
                </label>
                <Input
                  id="generated-cno"
                  readOnly
                  value={createdOrg.cno}
                  className="border-emerald-200 bg-white font-mono text-base tracking-[0.3em] text-emerald-950"
                />
                <p className="text-sm text-emerald-800">
                  Redirecting to the organization details page in 2 seconds.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button
                  type="button"
                  onClick={() => navigate(`/organizations/${createdOrg._id}`)}
                >
                  Open organization
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/organizations">
                    Back to organizations
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Pvt Ltd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATES_OPTIONS.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {mutation.isError && (
                  <p className="text-destructive text-sm">
                    {(mutation.error as ApiError)?.response?.data?.message ??
                      "Failed to create organization. Please try again."}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Creating…" : "Create organization"}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/organizations">Cancel</Link>
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
