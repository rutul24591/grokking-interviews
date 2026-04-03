export type DraftField = {
  id: string;
  label: string;
  value: string;
  pending: boolean;
};

export type AutosaveSnapshot = {
  title: string;
  cadence: string;
  fields: DraftField[];
  pendingJobs: number;
  lastSavedAt: string;
  unsavedChanges: number;
  network: "healthy" | "offline";
  remoteRevision: string;
  localRevision: string;
  restoreSuggestion: string;
};

export const autosaveSnapshot: AutosaveSnapshot = {
  title: "Incident follow-up draft",
  cadence: "save every 12 seconds after idle",
  fields: [
    { id: "summary", label: "Summary", value: "Rollback completed after shard imbalance.", pending: false },
    { id: "impact", label: "Impact", value: "Checkout latency rose above SLA for 18 minutes.", pending: true },
    { id: "actions", label: "Action items", value: "Add backpressure alert before deploy cutover.", pending: false }
  ],
  pendingJobs: 1,
  lastSavedAt: "09:42 UTC",
  unsavedChanges: 2,
  network: "healthy",
  remoteRevision: "rev-41",
  localRevision: "rev-42",
  restoreSuggestion: "Hold autosave while review banner is visible to avoid overwriting newer server content."
};
