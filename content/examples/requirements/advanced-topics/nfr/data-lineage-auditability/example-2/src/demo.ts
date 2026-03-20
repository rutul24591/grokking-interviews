import { HashLedger } from "./ledger";

const ledger = new HashLedger();
ledger.append("job_started", { job: "daily" });
ledger.append("dataset_written", { dataset: "raw", rows: 3 });
ledger.append("dataset_written", { dataset: "agg", rows: 2 });

console.log("verify:", ledger.verify());

// Simulate tampering: mutate an older event
const events = ledger.list();
events[1].payload.rows = 999;

console.log("after tamper verify:", ledger.verify());

