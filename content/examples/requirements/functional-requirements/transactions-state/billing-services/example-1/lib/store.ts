type Cycle = "daily" | "monthly";

const state = {
  cycle: "monthly" as Cycle,
  jobs: [
    { id: "job-1", account: "Enterprise A", stage: "invoice-created", retries: 0, amount: "$420" },
    { id: "job-2", account: "Startup C", stage: "charge-retry", retries: 2, amount: "$89" },
    { id: "job-3", account: "Scaleup D", stage: "posted-ledger", retries: 0, amount: "$130" }
  ],
  lastMessage: "Billing services should make cycle execution, retries, and ledger progression visible across one runbook."
};

export function snapshot() {
  return structuredClone({
    cycle: state.cycle,
    summary: {
      retries: state.jobs.filter((job) => job.retries > 0).length,
      inFlight: state.jobs.filter((job) => job.stage !== "posted-ledger").length
    },
    jobs: state.jobs,
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "switch-cycle" | "run-job", value?: string) {
  if (type === "switch-cycle" && value) {
    state.cycle = value as Cycle;
    state.lastMessage = `Loaded ${state.cycle} billing cycle execution queue.`;
    return snapshot();
  }

  if (type === "run-job" && value) {
    state.jobs = state.jobs.map((job) =>
      job.id === value
        ? {
            ...job,
            stage: job.stage === "charge-retry" ? "posted-ledger" : "charge-retry",
            retries: job.stage === "charge-retry" ? job.retries : job.retries + 1
          }
        : job
    );
    state.lastMessage = `Executed billing service job ${value}.`;
  }

  return snapshot();
}
