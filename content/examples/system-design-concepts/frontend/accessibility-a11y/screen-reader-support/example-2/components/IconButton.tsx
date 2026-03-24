import { VisuallyHidden } from "@/components/VisuallyHidden";

export function IconButton({ label }: { label: string }) {
  return (
    <button className="mt-3 inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15">
      <span aria-hidden="true">🔎</span>
      <VisuallyHidden>{label}</VisuallyHidden>
    </button>
  );
}

