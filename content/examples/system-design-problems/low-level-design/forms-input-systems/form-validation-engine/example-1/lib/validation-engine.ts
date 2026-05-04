import type {
  FieldName,
  ValidationIssue,
  ValidationPlan,
  ValidationResult,
  Validator,
} from "./types";

function pushIssues(
  bucket: Record<FieldName, ValidationIssue[]>,
  issues: ValidationIssue[],
) {
  for (const issue of issues) {
    const field = issue.field;
    if (!field) continue;
    (bucket[field] ??= []).push(issue);
  }
}

export function normalizeIssues(issues: ValidationIssue[]): ValidationResult {
  const fieldErrors: Record<FieldName, ValidationIssue[]> = {};
  const formErrors: ValidationIssue[] = [];

  for (const issue of issues) {
    if (issue.field) (fieldErrors[issue.field] ??= []).push(issue);
    else formErrors.push(issue);
  }

  const isValid =
    formErrors.length === 0 &&
    Object.values(fieldErrors).every((arr) => arr.length === 0);

  return { isValid, fieldErrors, formErrors };
}

export function runSyncValidators<TValues>(
  plan: ValidationPlan<TValues>,
  values: TValues,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  for (const fv of plan.fields) {
    for (const v of fv.validators) {
      if (v.kind !== "sync") continue;
      const res = v.run(values);
      if (res?.length) issues.push(...res);
    }
  }

  for (const v of plan.formValidators ?? []) {
    if (v.kind !== "sync") continue;
    const res = v.run(values);
    if (res?.length) issues.push(...res);
  }

  return normalizeIssues(issues);
}

export async function runAsyncValidators<TValues>(
  plan: ValidationPlan<TValues>,
  values: TValues,
  allow: (validatorId: string) => boolean,
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];

  async function run(v: Validator<TValues>) {
    if (v.kind !== "async") return;
    if (!allow(v.id)) return;
    const res = await v.run(values);
    if (!allow(v.id)) return;
    if (res?.length) issues.push(...res);
  }

  for (const fv of plan.fields) for (const v of fv.validators) await run(v);
  for (const v of plan.formValidators ?? []) await run(v);

  return normalizeIssues(issues);
}

