This example isolates one optimization: **adaptive polling**.

Battery and CPU usage are heavily influenced by “background work”:
- polling loops
- retries
- heartbeat traffic

Production best practices:
- back off when hidden (`document.visibilityState`)
- pause when offline
- add jitter to avoid synchronized thundering herds

