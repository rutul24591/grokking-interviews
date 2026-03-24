import { useId } from "react";

type InputProps = {
  id: string;
  name: string;
  "aria-labelledby": string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

export function Field({
  label,
  help,
  error,
  children
}: {
  label: string;
  help?: string;
  error?: string;
  children: (props: InputProps) => React.ReactNode;
}) {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const labelId = `${baseId}-label`;
  const helpId = `${baseId}-help`;
  const errorId = `${baseId}-error`;

  const describedBy = [help ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <span id={labelId} className="text-sm font-semibold text-slate-100">
        {label}
      </span>

      {children({
        id: inputId,
        name: "email",
        "aria-labelledby": labelId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined
      })}

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

