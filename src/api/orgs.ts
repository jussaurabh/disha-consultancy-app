import { apiClient } from "@/lib/api-client";

export interface Organization {
  _id: string;
  company_name: string;
  cno: string;
  state: string;
  address?: string;
  email?: string;
  phone_no?: string;
  branch_location?: string;
  city?: string;
  district?: string;
  pincode?: string;
  status?: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
  // Company Info additions
  est_type?: string;
  unit_cont_name?: string;
  company_view?: string;
  rule_type?: string;
  // Bank
  bank_name?: string;
  ifsc_code?: string;
  account_no?: string;
  bank_address?: string;
  // Payroll & Leave
  pan_no?: string;
  tan_no?: string;
  pt_number?: string;
  pt_as_per_employee_state?: boolean;
  professional_tax?: boolean;
  it_auto?: boolean;
  pay_scale_on?: string;
  leave_method?: string;
  leave_cal_on?: string;
  min_wage_limit?: number;
  bonus_percent?: number;
  bonus_limit?: number;
  ot_on?: string;
  ot_ratio?: number;
  esi_on_ot?: boolean;
  // PF
  pf_no?: string;
  pf_start_date?: string;
  pf_limit?: number;
  pf_ext_code?: string;
  pf_diff_epf?: number;
  pf_ac10?: number;
  pf_ac2?: number;
  pf_ac2_min?: number;
  pf_ac21?: number;
  pf_ac21_min?: number;
  pf_ac22?: number;
  pf_ac22_min?: number;
  pf_group?: string;
  pf_cmp_gr?: string;
  pf_office?: string;
  pf_cal?: "basic" | "allowance";
  // ESI
  esi_no?: string;
  esi_start_date?: string;
  esi_limit?: number;
  esi_comp_gr?: string;
  esi_employee_percent?: number;
  esi_employer_percent?: number;
  esi_local_office?: string;
  esi_cal?: "gross" | "all";
}

export interface CreateOrgBody {
  company_name: string;
  /** CNO is auto-generated server-side and should be omitted on create. */
  cno?: string;
  state: string;
}

export interface UpdateOrgBody {
  company_name?: string;
  cno?: string;
  state?: string;
  address?: string;
  email?: string;
  phone_no?: string;
  branch_location?: string;
  city?: string;
  district?: string;
  pincode?: string;
  status?: "active" | "inactive";
  est_type?: string;
  unit_cont_name?: string;
  company_view?: string;
  rule_type?: string;
  bank_name?: string;
  ifsc_code?: string;
  account_no?: string;
  bank_address?: string;
  pan_no?: string;
  tan_no?: string;
  pt_number?: string;
  pt_as_per_employee_state?: boolean;
  professional_tax?: boolean;
  it_auto?: boolean;
  pay_scale_on?: string;
  leave_method?: string;
  leave_cal_on?: string;
  min_wage_limit?: number;
  bonus_percent?: number;
  bonus_limit?: number;
  ot_on?: string;
  ot_ratio?: number;
  esi_on_ot?: boolean;
  pf_no?: string;
  pf_start_date?: string;
  pf_limit?: number;
  pf_ext_code?: string;
  pf_diff_epf?: number;
  pf_ac10?: number;
  pf_ac2?: number;
  pf_ac2_min?: number;
  pf_ac21?: number;
  pf_ac21_min?: number;
  pf_ac22?: number;
  pf_ac22_min?: number;
  pf_group?: string;
  pf_cmp_gr?: string;
  pf_office?: string;
  pf_cal?: "basic" | "allowance";
  esi_no?: string;
  esi_start_date?: string;
  esi_limit?: number;
  esi_comp_gr?: string;
  esi_employee_percent?: number;
  esi_employer_percent?: number;
  esi_local_office?: string;
  esi_cal?: "gross" | "all";
}

export interface ListOrgsResponse {
  data: Organization[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const orgsApi = {
  createOrg: (body: CreateOrgBody) =>
    apiClient.post<Organization>("/api/consultancy/orgs", body),

  listOrgs: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ListOrgsResponse>("/api/consultancy/orgs", { params }),

  getOrg: (id: string) =>
    apiClient.get<Organization>(`/api/consultancy/orgs/${id}`),

  updateOrg: (id: string, body: UpdateOrgBody) =>
    apiClient.patch<Organization>(`/api/consultancy/orgs/${id}`, body),

  deleteOrg: (id: string) =>
    apiClient.delete<{ deleted: true }>(`/api/consultancy/orgs/${id}`),
};
