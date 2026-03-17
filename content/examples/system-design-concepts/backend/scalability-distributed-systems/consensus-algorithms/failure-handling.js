// If leader missing, wait for election and retry
await waitForLeader();
appendLog(entry);
