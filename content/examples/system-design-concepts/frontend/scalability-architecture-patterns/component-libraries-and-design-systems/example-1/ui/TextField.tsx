import { useId } from "react";
import { cn } from "@/lib/cn";

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  help?: string;
  error?: string;
};

export function TextField({ label, help, error, className, ...props }: TextFieldProps) {
  const base = useId();
  const helpId = `${base}-help`;
  const errorId = `${base}-error`;
  const describedBy = [help ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div data-ds="TextField">
      <label className="text-sm font-semibold text-[var(--text)]">
        {label}
        <input
          {...props}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(
            "mt-2 w-full rounded-md border border-[var(--border)] bg-black/30 px-3 py-2 text-sm text-[var(--text)] outline-none",
            "focus:border-indigo-400/60",
            className
          )}
        />
      </label>
      {help ? (
        <p id={helpId} className="mt-2 text-sm text-[var(--muted)]">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-semibold text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

