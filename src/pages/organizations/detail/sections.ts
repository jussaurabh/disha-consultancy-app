export const SECTIONS = [
  { id: "company", label: "Company" },
  { id: "contact", label: "Contact" },
  { id: "bank", label: "Bank" },
  { id: "payroll", label: "Payroll" },
  { id: "pf", label: "PF" },
  { id: "esi", label: "ESI" },
  { id: "users", label: "Users" },
  { id: "settings", label: "Settings" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const SECTION_COPY: Record<
  SectionId,
  { title: string; description: string; success: string }
> = {
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
  users: {
    title: "Users",
    description: "Members and pending invites for this organization",
    success: "Users updated",
  },
};