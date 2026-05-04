export type FieldName = string;

export type ValidationSeverity = "error" | "warning";

export type ValidationIssue = {
  field?: FieldName;
  code: string;
  message: string;
  severity?: ValidationSeverity;
};

export type ValidationResult = {
  isValid: boolean;
  fieldErrors: Record<FieldName, ValidationIssue[]>;
  formErrors: ValidationIssue[];
};

export type SyncValidator<TValues> = (values: TValues) => ValidationIssue[] | null;
export type AsyncValidator<TValues> = (values: TValues) => Promise<ValidationIssue[] | null>;

export type Validator<TValues> =
  | { kind: "sync"; id: string; run: SyncValidator<TValues> }
  | { kind: "async"; id: string; run: AsyncValidator<TValues> };

export type FieldValidator<TValues> = {
  field: FieldName;
  validators: Validator<TValues>[];
};

export type ValidationPlan<TValues> = {
  fields: FieldValidator<TValues>[];
  formValidators?: Validator<TValues>[];
};

