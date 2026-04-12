export const EST_TYPE_OPTIONS = [
  "Factory",
  "Establishment",
  "Contractor",
  "Shop & Establishment",
] as const;

export const COMPANY_VIEW_OPTIONS = ["Main", "Branch", "Unit"] as const;

export const RULE_TYPE_OPTIONS = [
  "Factory Act",
  "Shop & Establishment",
  "Mines Act",
  "Plantation Act",
  "Contract Labour Act",
] as const;

export const PAY_SCALE_ON_OPTIONS = [
  "Working Days",
  "Calendar Days",
  "Fixed Days (26)",
  "Fixed Days (30)",
] as const;

export const LEAVE_METHOD_OPTIONS = [
  "As Per Calendar",
  "Earned Leave",
  "Fixed",
] as const;

export const LEAVE_CAL_ON_OPTIONS = ["Salary", "Basic", "Gross"] as const;

export const OT_ON_OPTIONS = [
  "None",
  "Basic",
  "Gross",
  "Minimum Wages",
] as const;

export const BANK_NAME_OPTIONS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
  "Other",
] as const;

export const STATES_OPTIONS = [
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal_pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west_bengal", label: "West Bengal" },
  { value: "andaman_nicobar", label: "Andaman and Nicobar Islands" },
  { value: "chandigarh", label: "Chandigarh" },
  { value: "dadra_nagar_haveli", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "lakshadweep", label: "Lakshadweep" },
  { value: "delhi", label: "National Capital Territory of Delhi" },
  { value: "puducherry", label: "Puducherry" },
  { value: "ladakh", label: "Ladakh" },
  { value: "jammu_kashmir", label: "Jammu and Kashmir" },
] as const;
