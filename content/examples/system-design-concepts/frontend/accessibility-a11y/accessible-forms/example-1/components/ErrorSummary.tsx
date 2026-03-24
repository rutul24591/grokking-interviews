import { forwardRef } from "react";
import type { FormErrors } from "@/lib/validate";

export const ErrorSummary = forwardRef<HTMLDivElement, { errors: FormErrors }>(function ErrorSummary({ errors }, ref) {
  const items = Object.entries(errors).filter(([, msg]) => Boolean(msg)) as Array<[string, string]>;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="mb-6 rounded-lg border border-rose-400/30 bg-rose-500/10 p-4 outline-none focus:ring-2 focus:ring-rose-300/30"
      aria-label="Form errors"
    >
      <h2 className="text-sm font-semibold text-rose-100">Fix the following</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-rose-100">
        {items.map(([field, msg]) => (
          <li key={field}>
            <a className="underline" href={`#${field}`}>
              {msg}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

