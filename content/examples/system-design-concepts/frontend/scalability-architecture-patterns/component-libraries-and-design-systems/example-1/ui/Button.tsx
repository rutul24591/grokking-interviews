import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      data-ds="Button"
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold outline-none",
        "focus:ring-2 focus:ring-indigo-400/40 disabled:opacity-40",
        size === "sm" ? "px-3 py-1.5 text-sm" : "",
        variant === "primary" ? "bg-indigo-500/25 hover:bg-indigo-500/35" : "",
        variant === "secondary" ? "bg-white/10 hover:bg-white/15" : "",
        variant === "danger" ? "bg-rose-500/15 text-rose-100 hover:bg-rose-500/20" : "",
        className
      )}
      {...props}
    />
  );
});

