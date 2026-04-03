export type ValidationField = {
  id: "displayName" | "email" | "password" | "confirmPassword" | "region";
  label: string;
  type: string;
  placeholder: string;
};

export const validationFields: ValidationField[] = [
  { id: "displayName", label: "Display name", type: "text", placeholder: "Principal Engineer" },
  { id: "email", label: "Work email", type: "email", placeholder: "name@company.com" },
  { id: "password", label: "Password", type: "password", placeholder: "At least 10 characters" },
  { id: "confirmPassword", label: "Confirm password", type: "password", placeholder: "Repeat password" },
  { id: "region", label: "Region", type: "text", placeholder: "us-east" }
];

export const validationPolicies = [
  "Display name must be at least 4 characters.",
  "Email must use the company domain.",
  "Password needs 10+ characters and one number.",
  "Confirmation must match password before submit."
];
