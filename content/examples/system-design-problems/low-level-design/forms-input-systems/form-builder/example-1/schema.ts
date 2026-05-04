export type FieldId = string;

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "date"
  | "file";

export type Condition = {
  dependsOn: FieldId[];
  when: (values: Record<FieldId, unknown>) => boolean;
};

export type FieldSchema = {
  id: FieldId;
  kind: FieldKind;
  label: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  visibleWhen?: Condition;
  enabledWhen?: Condition;
};

export type StepSchema = {
  id: string;
  title: string;
  fields: FieldSchema[];
};

export type FormSchema = {
  id: string;
  version: number;
  steps?: StepSchema[];
  fields?: FieldSchema[];
};

