export const ADMIN = ["administrator"];

export const MANAGERS = [
  "operations_manager",
  "account_manager",
  "project_manager",
  "sales_manager",
  "vendor_manager",
  "finance_manager",
  "accountant",
  "office_admin",
  "language_quality_manager",
  "language_lead",
];

export const ADMIN_AND_MANAGERS = [...ADMIN, ...MANAGERS];

export const VENDOR = ["vendor"];

export const CLIENT = ["client"];

// Accessible to admin, managers, AND vendors (e.g. the /jobs page)
export const ALL_STAFF = [...ADMIN_AND_MANAGERS, ...VENDOR];
