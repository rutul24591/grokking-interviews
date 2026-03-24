import { forwardRef } from "react";

export type ErrorItem = { fieldId: string; message: string };

export const ErrorSummary = forwardRef<HTMLDivElement, { items: ErrorItem[] }>(function ErrorSummary({ items }, ref) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="mb-6 rounded-lg border border-rose-400/30 bg-rose-500/10 p-4 outline-none focus:ring-2 focus:ring-rose-300/30"
      role="alert"
      aria-label="Form errors"
    >
      <h2 className="text-sm font-semibold text-rose-100">Fix the following</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-rose-100">
        {items.map((i) => (
          <li key={i.fieldId}>
            <a className="underline" href={`#${i.fieldId}`}>
              {i.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

