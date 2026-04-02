---
title: "Service Runbook"
lastUpdated: "2026-03-20"
owner: "platform-oncall"
---

# Overview
This service powers content rendering.

# Runbook
## Restart
```bash
kubectl rollout restart deploy/content-renderer
```

# Ownership
- Team: platform-oncall

