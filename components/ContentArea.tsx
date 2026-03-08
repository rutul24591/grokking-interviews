export function ContentArea({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full flex-1 overflow-y-auto rounded-2xl border border-theme bg-panel px-6 py-8 shadow-soft-theme">
      {children}
    </main>
  );
}
