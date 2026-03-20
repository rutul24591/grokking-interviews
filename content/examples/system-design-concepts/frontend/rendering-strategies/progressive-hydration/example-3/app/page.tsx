import ScheduledSlot from "@/app/_components/ScheduledSlot";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Progressive Hydration Scheduling</h1>
        <p className="mt-1 text-sm text-slate-300">
          Multiple islands scheduled for idle + shared dynamic import + preemption.
        </p>

        <div className="mt-6 grid gap-4">
          <ScheduledSlot label="Widget A" seed={11} />
          <ScheduledSlot label="Widget B" seed={22} />
          <ScheduledSlot label="Widget C" seed={33} />
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Production note: coordinate progressive hydration with route transitions and analytics to avoid unexpected CPU spikes.
        </div>
      </div>
    </main>
  );
}

