import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Banknote, Building2, ChevronRight, HeartPulse, Landmark, Loader2, MapPin, Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { orgsApi, type Organization, type UpdateOrgBody } from "@/api/orgs";
import {
  BANK_NAME_OPTIONS,
  COMPANY_VIEW_OPTIONS,
  EST_TYPE_OPTIONS,
  LEAVE_CAL_ON_OPTIONS,
  LEAVE_METHOD_OPTIONS,
  OT_ON_OPTIONS,
  PAY_SCALE_ON_OPTIONS,
  RULE_TYPE_OPTIONS,
  STATES_OPTIONS,
} from "@/lib/org-options";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Schemas ---

const companyDetailsSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  cno: z.string().min(1, "CNO is required"),
  state: z.string().min(1, "State is required"),
  status: z.enum(["active", "inactive"]).optional(),
  est_type: z.string().optional(),
  unit_cont_name: z.string().optional(),
  company_view: z.string().optional(),
  rule_type: z.string().optional(),
});

const contactSchema = z.object({
  address: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone_no: z.string().optional(),
  branch_location: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  pincode: z.string().optional(),
});

const bankDetailsSchema = z.object({
  bank_name: z.string().optional(),
  ifsc_code: z.string().optional(),
  account_no: z.string().optional(),
  bank_address: z.string().optional(),
});

const payrollLeaveSchema = z.object({
  pan_no: z.string().optional(),
  tan_no: z.string().optional(),
  pt_number: z.string().optional(),
  pt_as_per_employee_state: z.boolean().optional(),
  professional_tax: z.boolean().optional(),
  it_auto: z.boolean().optional(),
  pay_scale_on: z.string().optional(),
  leave_method: z.string().optional(),
  leave_cal_on: z.string().optional(),
  min_wage_limit: z.number().optional(),
  bonus_percent: z.number().optional(),
  bonus_limit: z.number().optional(),
  ot_on: z.string().optional(),
  ot_ratio: z.number().optional(),
  esi_on_ot: z.boolean().optional(),
});

const pfSchema = z.object({
  pf_no: z.string().optional(),
  pf_start_date: z.string().optional(),
  pf_office: z.string().optional(),
  pf_group: z.string().optional(),
  pf_cmp_gr: z.string().optional(),
  pf_limit: z.number().optional(),
  pf_ext_code: z.string().optional(),
  pf_diff_epf: z.number().optional(),
  pf_cal: z.enum(["basic", "allowance"]).optional(),
  pf_ac10: z.number().optional(),
  pf_ac2: z.number().optional(),
  pf_ac2_min: z.number().optional(),
  pf_ac21: z.number().optional(),
  pf_ac21_min: z.number().optional(),
  pf_ac22: z.number().optional(),
  pf_ac22_min: z.number().optional(),
});

const esiSchema = z.object({
  esi_no: z.string().optional(),
  esi_start_date: z.string().optional(),
  esi_local_office: z.string().optional(),
  esi_comp_gr: z.string().optional(),
  esi_limit: z.number().optional(),
  esi_employee_percent: z.number().optional(),
  esi_employer_percent: z.number().optional(),
  esi_cal: z.enum(["gross", "all"]).optional(),
});

type CompanyDetailsValues = z.infer<typeof companyDetailsSchema>;
type ContactValues = z.infer<typeof contactSchema>;
type BankDetailsValues = z.infer<typeof bankDetailsSchema>;
type PayrollLeaveValues = z.infer<typeof payrollLeaveSchema>;
type PFValues = z.infer<typeof pfSchema>;
type ESIValues = z.infer<typeof esiSchema>;
type ApiError = { response?: { data?: { message?: string } } };

const SECTIONS = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "contact", label: "Contact", icon: MapPin },
  { id: "bank", label: "Bank", icon: Landmark },
  { id: "payroll", label: "Payroll", icon: Banknote },
  { id: "pf", label: "PF", icon: ShieldCheck },
  { id: "esi", label: "ESI", icon: HeartPulse },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const SECTION_COPY: Record<SectionId, { title: string; description: string; success: string }> = {
  company: {
    title: "Company Details",
    description: "Basic registration information for the organization",
    success: "Company details saved",
  },
  contact: {
    title: "Contact & Address",
    description: "Business contact details and registered address",
    success: "Contact details saved",
  },
  bank: {
    title: "Bank Details",
    description: "Bank account information for salary disbursement",
    success: "Bank details saved",
  },
  payroll: {
    title: "Payroll & Leave",
    description: "Pay scale, leave, bonus, and overtime configuration",
    success: "Payroll settings saved",
  },
  pf: {
    title: "Provident Fund",
    description: "PF registration, limits, and contribution accounts",
    success: "PF settings saved",
  },
  esi: {
    title: "Employee State Insurance",
    description: "ESI registration, contribution rates, and calculation method",
    success: "ESI settings saved",
  },
  settings: {
    title: "Settings",
    description: "Organization settings and administration",
    success: "Settings saved",
  },
};

const SECTION_CARD = "gap-0 p-0";
const SECTION_HEADER = "border-b pt-6 !pb-5";
const SECTION_CONTENT = "pt-5 pb-6";
const SECTION_FOOTER = "border-t !pt-4 pb-4 justify-end";
const FORM_GRID_2 = "grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2";
const FORM_GRID_3 = "grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3";

function getMutationErrorMessage(error: unknown) {
  return (error as ApiError)?.response?.data?.message ?? "Failed to save changes";
}

function DeleteOrgDialog({
  open,
  orgName,
  isLoading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  orgName: string;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Delete Organization</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-medium text-foreground">{orgName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Company details tab ---

function CompanyDetailsForm({ org, canEdit }: { org: Organization; canEdit: boolean }) {
  const queryClient = useQueryClient();

  const form = useForm<CompanyDetailsValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: {
      company_name: org.company_name,
      cno: org.cno,
      state: org.state,
      status: org.status ?? "active",
      est_type: org.est_type ?? "",
      unit_cont_name: org.unit_cont_name ?? "",
      company_view: org.company_view ?? "",
      rule_type: org.rule_type ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: UpdateOrgBody) => orgsApi.updateOrg(org._id, values).then((r) => r.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", org._id], updated);
      toast.success(SECTION_COPY.company.success);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });

  return (
    <Card className={SECTION_CARD}>
      <CardHeader className={SECTION_HEADER}>
        <CardTitle className="text-base">{SECTION_COPY.company.title}</CardTitle>
        <CardDescription>{SECTION_COPY.company.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <CardContent className={SECTION_CONTENT}>
            <div className={FORM_GRID_2}>
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input disabled={!canEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNO</FormLabel>
                    <FormControl>
                      <Input readOnly disabled={!canEdit} {...field} />
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
                    <Select value={field.value} onValueChange={field.onChange} disabled={!canEdit}>
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value ?? "active"} onValueChange={(v) => field.onChange(v as "active" | "inactive")} disabled={!canEdit}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="est_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Establishment type</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EST_TYPE_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_cont_name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Unit / Contractor name</FormLabel>
                    <FormControl>
                      <Input disabled={!canEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_view"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company view</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMPANY_VIEW_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rule_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule type</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RULE_TYPE_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          {canEdit && (
            <CardFooter className={SECTION_FOOTER}>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}

// --- Contact & address tab ---

function ContactAddressForm({ org, canEdit }: { org: Organization; canEdit: boolean }) {
  const queryClient = useQueryClient();

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      address: org.address ?? "",
      email: org.email ?? "",
      phone_no: org.phone_no ?? "",
      branch_location: org.branch_location ?? "",
      city: org.city ?? "",
      district: org.district ?? "",
      pincode: org.pincode ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ContactValues) => {
      const body = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === "" ? undefined : v])) as UpdateOrgBody;
      return orgsApi.updateOrg(org._id, body).then((r) => r.data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", org._id], updated);
      toast.success(SECTION_COPY.contact.success);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });

  return (
    <Card className={SECTION_CARD}>
      <CardHeader className={SECTION_HEADER}>
        <CardTitle className="text-base">{SECTION_COPY.contact.title}</CardTitle>
        <CardDescription>{SECTION_COPY.contact.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <CardContent className={SECTION_CONTENT}>
            <div className="space-y-4">
              <div className={FORM_GRID_2}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" disabled={!canEdit} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input disabled={!canEdit} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input disabled={!canEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch / Location</FormLabel>
                    <FormControl>
                      <Input disabled={!canEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className={FORM_GRID_3}>
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input disabled={!canEdit} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input disabled={!canEdit} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input disabled={!canEdit} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          {canEdit && (
            <CardFooter className={SECTION_FOOTER}>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}

// --- Bank details tab ---

function BankDetailsForm({ org, canEdit }: { org: Organization; canEdit: boolean }) {
  const queryClient = useQueryClient();

  const form = useForm<BankDetailsValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      bank_name: org.bank_name ?? "",
      ifsc_code: org.ifsc_code ?? "",
      account_no: org.account_no ?? "",
      bank_address: org.bank_address ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: BankDetailsValues) => {
      const body = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === "" ? undefined : v])) as UpdateOrgBody;
      return orgsApi.updateOrg(org._id, body).then((r) => r.data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", org._id], updated);
      toast.success(SECTION_COPY.bank.success);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });

  return (
    <Card className={SECTION_CARD}>
      <CardHeader className={SECTION_HEADER}>
        <CardTitle className="text-base">{SECTION_COPY.bank.title}</CardTitle>
        <CardDescription>{SECTION_COPY.bank.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <CardContent className={SECTION_CONTENT}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank name</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BANK_NAME_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className={FORM_GRID_2}>
                <FormField
                  control={form.control}
                  name="ifsc_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC code</FormLabel>
                      <FormControl>
                        <Input disabled={!canEdit} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account number</FormLabel>
                      <FormControl>
                        <Input disabled={!canEdit} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bank_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank address</FormLabel>
                    <FormControl>
                      <Input disabled={!canEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          {canEdit && (
            <CardFooter className={SECTION_FOOTER}>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}

// --- Payroll & Leave tab ---

function PayrollLeaveForm({ org, canEdit }: { org: Organization; canEdit: boolean }) {
  const queryClient = useQueryClient();

  const form = useForm<PayrollLeaveValues>({
    resolver: zodResolver(payrollLeaveSchema),
    defaultValues: {
      pan_no: org.pan_no ?? "",
      tan_no: org.tan_no ?? "",
      pt_number: org.pt_number ?? "",
      pt_as_per_employee_state: org.pt_as_per_employee_state ?? false,
      professional_tax: org.professional_tax ?? false,
      it_auto: org.it_auto ?? false,
      pay_scale_on: org.pay_scale_on ?? "",
      leave_method: org.leave_method ?? "",
      leave_cal_on: org.leave_cal_on ?? "",
      min_wage_limit: org.min_wage_limit ?? 0,
      bonus_percent: org.bonus_percent ?? 0,
      bonus_limit: org.bonus_limit ?? 0,
      ot_on: org.ot_on ?? "",
      ot_ratio: org.ot_ratio ?? 0,
      esi_on_ot: org.esi_on_ot ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: PayrollLeaveValues) => {
      const body = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === "" ? undefined : v])) as UpdateOrgBody;
      return orgsApi.updateOrg(org._id, body).then((r) => r.data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", org._id], updated);
      toast.success(SECTION_COPY.payroll.success);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });

  return (
    <Card className={SECTION_CARD}>
      <CardHeader className={SECTION_HEADER}>
        <CardTitle className="text-base">{SECTION_COPY.payroll.title}</CardTitle>
        <CardDescription>{SECTION_COPY.payroll.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <CardContent className={SECTION_CONTENT}>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Tax & Registration</h3>
                <div className={FORM_GRID_3}>
                  <FormField
                    control={form.control}
                    name="pan_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN number</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tan_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TAN number</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pt_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PT number</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Tax flags</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="pt_as_per_employee_state"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">PT as per employee state</FormLabel>
                          <FormDescription className="text-xs text-muted-foreground">Calculate PT based on employee state</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value ?? false} onCheckedChange={field.onChange} disabled={!canEdit} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="professional_tax"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Professional tax</FormLabel>
                          <FormDescription className="text-xs text-muted-foreground">Enable professional tax deduction</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value ?? false} onCheckedChange={field.onChange} disabled={!canEdit} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="it_auto"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">IT auto</FormLabel>
                          <FormDescription className="text-xs text-muted-foreground">Automatically calculate income tax</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value ?? false} onCheckedChange={field.onChange} disabled={!canEdit} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Pay & Leave settings</h3>
                <div className={FORM_GRID_3}>
                  <FormField
                    control={form.control}
                    name="pay_scale_on"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pay scale on</FormLabel>
                        <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PAY_SCALE_ON_OPTIONS.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leave_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave method</FormLabel>
                        <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LEAVE_METHOD_OPTIONS.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leave_cal_on"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave calculated on</FormLabel>
                        <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LEAVE_CAL_ON_OPTIONS.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="min_wage_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. wage limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bonus_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bonus %</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bonus_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bonus limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Overtime</h3>
                <div className={FORM_GRID_3}>
                  <FormField
                    control={form.control}
                    name="ot_on"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OT on</FormLabel>
                        <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OT_ON_OPTIONS.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ot_ratio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OT ratio</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="esi_on_ot"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">ESI on OT</FormLabel>
                          <FormDescription className="text-xs text-muted-foreground">Include overtime in ESI calculation</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value ?? false} onCheckedChange={field.onChange} disabled={!canEdit} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          {canEdit && (
            <CardFooter className={SECTION_FOOTER}>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}

// --- PF tab ---

function PFForm({ org, canEdit }: { org: Organization; canEdit: boolean }) {
  const queryClient = useQueryClient();

  const form = useForm<PFValues>({
    resolver: zodResolver(pfSchema),
    defaultValues: {
      pf_no: org.pf_no ?? "",
      pf_start_date: org.pf_start_date ?? "",
      pf_office: org.pf_office ?? "",
      pf_group: org.pf_group ?? "",
      pf_cmp_gr: org.pf_cmp_gr ?? "",
      pf_limit: org.pf_limit ?? 0,
      pf_ext_code: org.pf_ext_code ?? "",
      pf_diff_epf: org.pf_diff_epf ?? 0,
      pf_cal: org.pf_cal ?? undefined,
      pf_ac10: org.pf_ac10 ?? 0,
      pf_ac2: org.pf_ac2 ?? 0,
      pf_ac2_min: org.pf_ac2_min ?? 0,
      pf_ac21: org.pf_ac21 ?? 0,
      pf_ac21_min: org.pf_ac21_min ?? 0,
      pf_ac22: org.pf_ac22 ?? 0,
      pf_ac22_min: org.pf_ac22_min ?? 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: PFValues) => {
      const body = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === "" ? undefined : v])) as UpdateOrgBody;
      return orgsApi.updateOrg(org._id, body).then((r) => r.data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", org._id], updated);
      toast.success(SECTION_COPY.pf.success);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });

  return (
    <Card className={SECTION_CARD}>
      <CardHeader className={SECTION_HEADER}>
        <CardTitle className="text-base">{SECTION_COPY.pf.title}</CardTitle>
        <CardDescription>{SECTION_COPY.pf.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <CardContent className={SECTION_CONTENT}>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Registration</h3>
                <div className={FORM_GRID_2}>
                  <FormField
                    control={form.control}
                    name="pf_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PF number</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PF start date</FormLabel>
                        <FormControl>
                          <Input type="date" disabled={!canEdit} {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className={FORM_GRID_3}>
                  <FormField
                    control={form.control}
                    name="pf_office"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PF office</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PF group</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_cmp_gr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PF company group</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Limits & Codes</h3>
                <div className={FORM_GRID_3}>
                  <FormField
                    control={form.control}
                    name="pf_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PF limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_ext_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extension code</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_diff_epf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diff EPF</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">PF Calculation</h3>
                <FormField
                  control={form.control}
                  name="pf_cal"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">PF calculated on</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} disabled={!canEdit} className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="basic" id="pf-basic" />
                            <Label htmlFor="pf-basic" className="text-sm font-normal">
                              Basic
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="allowance" id="pf-allowance" />
                            <Label htmlFor="pf-allowance" className="text-sm font-normal">
                              Allowance
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Account contributions</h3>
                <div className={FORM_GRID_3}>
                  <FormField
                    control={form.control}
                    name="pf_ac10"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pension (A/C 10)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_ac2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A/C-2</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_ac2_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A/C-2 min (Rs.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_ac21"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A/C-21</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_ac21_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A/C-21 min (Rs.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pf_ac22"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A/C-22</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="pf_ac22_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A/C-22 min (Rs.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          {canEdit && (
            <CardFooter className={SECTION_FOOTER}>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}

// --- ESI tab ---

function ESIForm({ org, canEdit }: { org: Organization; canEdit: boolean }) {
  const queryClient = useQueryClient();

  const form = useForm<ESIValues>({
    resolver: zodResolver(esiSchema),
    defaultValues: {
      esi_no: org.esi_no ?? "",
      esi_start_date: org.esi_start_date ?? "",
      esi_local_office: org.esi_local_office ?? "",
      esi_comp_gr: org.esi_comp_gr ?? "",
      esi_limit: org.esi_limit ?? 0,
      esi_employee_percent: org.esi_employee_percent ?? 0,
      esi_employer_percent: org.esi_employer_percent ?? 0,
      esi_cal: org.esi_cal ?? undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ESIValues) => {
      const body = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === "" ? undefined : v])) as UpdateOrgBody;
      return orgsApi.updateOrg(org._id, body).then((r) => r.data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", org._id], updated);
      toast.success(SECTION_COPY.esi.success);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });

  return (
    <Card className={SECTION_CARD}>
      <CardHeader className={SECTION_HEADER}>
        <CardTitle className="text-base">{SECTION_COPY.esi.title}</CardTitle>
        <CardDescription>{SECTION_COPY.esi.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <CardContent className={SECTION_CONTENT}>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Registration</h3>
                <div className={FORM_GRID_2}>
                  <FormField
                    control={form.control}
                    name="esi_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ESI number</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="esi_start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ESI start date</FormLabel>
                        <FormControl>
                          <Input type="date" disabled={!canEdit} {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="esi_local_office"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local office</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="esi_comp_gr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ESI company group</FormLabel>
                        <FormControl>
                          <Input disabled={!canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Contributions</h3>
                <div className={FORM_GRID_3}>
                  <FormField
                    control={form.control}
                    name="esi_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ESI limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="esi_employee_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee %</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="esi_employer_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer %</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={!canEdit}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">ESI Calculation</h3>
                <FormField
                  control={form.control}
                  name="esi_cal"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">ESI calculated on</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} disabled={!canEdit} className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="gross" id="esi-gross" />
                            <Label htmlFor="esi-gross" className="text-sm font-normal">
                              Gross
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="all" id="esi-all" />
                            <Label htmlFor="esi-all" className="text-sm font-normal">
                              All
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          {canEdit && (
            <CardFooter className={SECTION_FOOTER}>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}

function SettingsForm({ org, canDelete, onDeleteClick }: { org: Organization; canDelete: boolean; onDeleteClick: () => void }) {
  return (
    <Card className={SECTION_CARD}>
      <CardHeader className={SECTION_HEADER}>
        <CardTitle className="text-base">{SECTION_COPY.settings.title}</CardTitle>
        <CardDescription>{SECTION_COPY.settings.description}</CardDescription>
      </CardHeader>
      <CardContent className={`${SECTION_CONTENT} space-y-6`}>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium text-foreground">Organization</p>
          <p className="mt-1 text-sm text-muted-foreground">{org.company_name}</p>
        </div>

        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Danger zone</h3>
            <p className="text-sm text-muted-foreground">Permanently remove this organization from the system. This action cannot be undone.</p>
          </div>
          <Button type="button" variant="destructive" className="mt-4 w-full sm:w-auto" onClick={onDeleteClick} disabled={!canDelete}>
            Delete Organization
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main page ---

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionId>("company");
  const [orgNameToDelete, setOrgNameToDelete] = useState<string | null>(null);

  const canEdit = hasPermission("org:update");
  const canDelete = hasPermission("org:delete");

  const {
    data: org,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["org", id],
    queryFn: () => orgsApi.getOrg(id!).then((r) => r.data),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => orgsApi.deleteOrg(id!),
    onSuccess: () => {
      toast.success("Organization deleted");
      navigate("/organizations");
    },
    onError: (error) => {
      toast.error((error as ApiError)?.response?.data?.message ?? "Failed to delete organization");
    },
  });

  const isNotFound = (error as { response?: { status?: number } })?.response?.status === 404;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />

        <div className="flex items-start gap-4">
          <Skeleton className="size-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden w-[200px] shrink-0 flex-col gap-2 lg:flex">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full rounded-md" />
            ))}
          </div>
          <Skeleton className="h-[420px] flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isNotFound || (isError && !org)) {
    const backTo = "/organizations";

    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100">
          <Building2 className="size-8 text-zinc-400" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold text-foreground">Organization not found</h2>
          <p className="text-sm text-muted-foreground">This organization may have been removed or you don't have access.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={backTo}>Back to organizations</Link>
        </Button>
      </div>
    );
  }

  if (!org) return null;

  const visibleSections = canDelete ? SECTIONS : SECTIONS.filter((section) => section.id !== "settings");
  const activeSectionLabel = visibleSections.find((section) => section.id === activeSection)?.label ?? SECTION_COPY.company.title;
  const statusBadgeClass = org.status === "inactive" ? "border-zinc-200 bg-zinc-100 text-zinc-600" : "border-green-200 bg-green-50 text-green-700";

  return (
    <>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/organizations" className="hover:text-foreground transition-colors">
            Organizations
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{org.company_name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="size-12 rounded-lg">
            <AvatarFallback className="rounded-lg bg-zinc-100 text-lg font-semibold text-zinc-600">
              {org.company_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="truncate text-xl font-semibold text-foreground">{org.company_name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>CNO: {org.cno}</span>
              <Badge className={cn("text-xs", statusBadgeClass)}>{org.status === "inactive" ? "Inactive" : "Active"}</Badge>
            </div>
          </div>
        </div>

        <div className="sm:hidden">
          <Select value={activeSection} onValueChange={(value) => setActiveSection(value as SectionId)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={activeSectionLabel} />
            </SelectTrigger>
            <SelectContent>
              {visibleSections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden gap-1 overflow-x-auto pb-4 sm:flex lg:hidden">
          {visibleSections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                activeSection === section.id ? "bg-zinc-900 text-white" : "bg-zinc-100 text-muted-foreground hover:bg-zinc-200",
              )}
            >
              <section.icon className="size-3.5" />
              {section.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          <nav aria-label="Organization sections" className="hidden w-[200px] shrink-0 lg:block">
            <div className="space-y-1">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  aria-current={activeSection === section.id ? "page" : undefined}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                    activeSection === section.id ? "bg-zinc-100 text-foreground" : "text-muted-foreground hover:bg-zinc-50 hover:text-foreground",
                  )}
                >
                  <section.icon className="size-4 shrink-0" />
                  {section.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="min-w-0 flex-1">
            {activeSection === "company" && <CompanyDetailsForm org={org} canEdit={canEdit} />}
            {activeSection === "contact" && <ContactAddressForm org={org} canEdit={canEdit} />}
            {activeSection === "bank" && <BankDetailsForm org={org} canEdit={canEdit} />}
            {activeSection === "payroll" && <PayrollLeaveForm org={org} canEdit={canEdit} />}
            {activeSection === "pf" && <PFForm org={org} canEdit={canEdit} />}
            {activeSection === "esi" && <ESIForm org={org} canEdit={canEdit} />}
            {activeSection === "settings" && canDelete && (
              <SettingsForm org={org} canDelete={canDelete} onDeleteClick={() => setOrgNameToDelete(org.company_name)} />
            )}
          </div>
        </div>
      </div>

      <DeleteOrgDialog
        open={orgNameToDelete !== null}
        orgName={orgNameToDelete ?? ""}
        isLoading={deleteMutation.isPending}
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setOrgNameToDelete(null);
          }
        }}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
}
