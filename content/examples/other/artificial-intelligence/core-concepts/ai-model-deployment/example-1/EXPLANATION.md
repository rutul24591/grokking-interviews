# Model Version Manager with Traffic Routing

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `datetime`).

## What This Demonstrates

This example implements a model version management system that tracks model versions with metadata, routes traffic between active and canary versions, supports instant rollback to the previous version, and maintains a full deployment audit trail for production AI systems.

## Code Walkthrough

### Key Classes

- **`ModelVersion`** (dataclass): Represents a deployed model version with `id`, `model_name`, `prompt_version`, `adapter_hash`, `deployed_at`, `quality_score`, `latency_ms`, and `status` (active/canary/previous/rolled_back).
- **`ModelVersionManager`**: The core manager class. Maintains a registry of versions, tracks the active and previous version pointers, and logs all deployment events.

### Execution Flow

1. **`main()`** creates a `ModelVersionManager` and registers three model versions (v1: GPT-4, v2: Claude 3.5, v3: Claude 3.5 with updated prompts).
2. v1 is set as the initial active version.
3. **`deploy_canary("v2", 5.0)`**: Deploys v2 as a canary receiving 5% of traffic. Returns the traffic split configuration.
4. **`promote_canary("v2")`**: Promotes v2 to active. The previous active version (v1) is marked as "previous" and stored for potential rollback.
5. **`deploy_canary("v3", 5.0)`**: Deploys v3 as a new canary alongside the now-active v2.
6. **`rollback()`**: Reverts to the previous version. Swaps the active and previous pointers and updates statuses accordingly.
7. **`get_deployment_history()`**: Returns the full chronological log of all deployment events (register, canary_deploy, promote_canary, rollback).

### Important Variables

- `self.active_version`: Points to the version currently receiving production traffic.
- `self.previous_version`: Points to the version that was active before the last promotion (enables instant rollback).
- `self.deployment_log`: Append-only log of all deployment events for audit trail.
- `traffic_pct`: Percentage of production traffic routed to the canary version.

## Key Takeaways

- Canary deployments allow gradual rollout with minimal blast radius -- if a new version has issues, only 5% of traffic is affected.
- Instant rollback requires maintaining a pointer to the previous active version, enabling recovery in seconds rather than redeploying.
- The adapter hash and prompt version fields track the full configuration needed to reproduce any deployed version.
- An append-only deployment log provides an audit trail for compliance and debugging production incidents.
- Production systems typically automate canary promotion based on quality metrics (e.g., if canary quality exceeds active for N consecutive evaluations).
