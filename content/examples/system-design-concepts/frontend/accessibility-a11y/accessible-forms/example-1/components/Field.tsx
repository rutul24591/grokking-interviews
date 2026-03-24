import { useId } from "react";

export function Field({
  id,
  label,
  value,
  onChange,
  help,
  error,
  required,
  autoComplete,
  inputMode
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const base = useId();
  const labelId = `${base}-${id}-label`;
  const helpId = `${base}-${id}-help`;
  const errorId = `${base}-${id}-error`;
  const describedBy = [help ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label id={labelId} htmlFor={id} className="text-sm font-semibold text-slate-100">
        {label} {required ? <span className="text-slate-300">(required)</span> : null}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
      />
      {help ? (
        <p id={helpId} className="mt-2 text-sm text-slate-300">
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

