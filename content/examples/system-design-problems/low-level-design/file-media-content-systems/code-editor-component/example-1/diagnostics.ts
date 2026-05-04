export type Severity = "error" | "warning" | "info";

export type Diagnostic = {
  id: string;
  severity: Severity;
  message: string;
  from: { line: number; col: number };
  to: { line: number; col: number };
};

export type DiagnosticsState = {
  byFile: Record<string, Diagnostic[]>;
};

