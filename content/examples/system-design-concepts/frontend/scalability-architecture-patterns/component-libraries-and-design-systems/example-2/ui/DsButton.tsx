import { forwardRef } from "react";
import { variants } from "@/lib/variants";

const buttonStyles = variants(
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-400/40 disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-indigo-500/25 hover:bg-indigo-500/35",
        secondary: "bg-white/10 hover:bg-white/15",
        danger: "bg-rose-500/15 text-rose-100 hover:bg-rose-500/20"
      },
      size: {
        sm: "px-3 py-1.5",
        md: ""
      }
    },
    defaults: { variant: "primary", size: "md" }
  }
);

export type DsButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md";
};

export const DsButton = forwardRef<HTMLButtonElement, DsButtonProps>(function DsButton(
  { className, variant, size, ...props },
  ref
) {
  return (
    <button ref={ref} className={buttonStyles({ className, variant, size })} {...props} />
  );
});

