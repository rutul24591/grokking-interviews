"""
Example 1: Model Version Manager with Traffic Routing

Demonstrates:
- Tracking model versions with metadata
- Routing traffic between model versions
- Instant rollback to previous version
- Version history and deployment audit trail
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class ModelVersion:
    id: str
    model_name: str
    prompt_version: str
    adapter_hash: str
    deployed_at: str
    quality_score: float
    latency_ms: float
    status: str  # "active", "canary", "previous", "rolled_back"


class ModelVersionManager:
    """Manages model versions and traffic routing."""

    def __init__(self):
        self.versions: Dict[str, ModelVersion] = {}
        self.active_version: Optional[str] = None
        self.previous_version: Optional[str] = None
        self.deployment_log: List[Dict] = []

    def register_version(self, version: ModelVersion) -> None:
        self.versions[version.id] = version
        self.deployment_log.append({
            "event": "registered",
            "version": version.id,
            "timestamp": version.deployed_at,
        })

    def deploy_canary(self, version_id: str, traffic_pct: float = 5.0) -> Dict[str, Any]:
        """Deploy a new version as canary."""
        if version_id not in self.versions:
            return {"error": f"Version {version_id} not found"}

        new = self.versions[version_id]
        new.status = "canary"

        self.deployment_log.append({
            "event": "canary_deploy",
            "version": version_id,
            "traffic_pct": traffic_pct,
            "timestamp": datetime.now().isoformat(),
        })

        return {
            "active": self.active_version,
            "canary": version_id,
            "traffic_split": {
                self.active_version: f"{100 - traffic_pct}%",
                version_id: f"{traffic_pct}%",
            },
        }

    def promote_canary(self, canary_id: str) -> Dict[str, Any]:
        """Promote canary to active version."""
        if canary_id not in self.versions:
            return {"error": "Canary version not found"}

        self.previous_version = self.active_version
        if self.previous_version and self.previous_version in self.versions:
            self.versions[self.previous_version].status = "previous"

        self.active_version = canary_id
        self.versions[canary_id].status = "active"

        self.deployment_log.append({
            "event": "promote_canary",
            "version": canary_id,
            "previous": self.previous_version,
            "timestamp": datetime.now().isoformat(),
        })

        return {"status": "promoted", "active": canary_id}

    def rollback(self) -> Dict[str, Any]:
        """Instant rollback to previous version."""
        if not self.previous_version:
            return {"error": "No previous version available for rollback"}

        if self.active_version and self.active_version in self.versions:
            self.versions[self.active_version].status = "rolled_back"

        old_active = self.active_version
        self.active_version = self.previous_version
        self.versions[self.active_version].status = "active"
        self.previous_version = old_active

        self.deployment_log.append({
            "event": "rollback",
            "from": old_active,
            "to": self.active_version,
            "timestamp": datetime.now().isoformat(),
        })

        return {"status": "rolled_back", "active": self.active_version}

    def get_deployment_history(self) -> List[Dict]:
        return self.deployment_log


def main():
    manager = ModelVersionManager()

    # Register versions
    manager.register_version(ModelVersion(
        "v1", "gpt-4", "v2.3", "none", "2024-01-01", 0.92, 1200, "active"
    ))
    manager.register_version(ModelVersion(
        "v2", "claude-3.5", "v2.4", "a1b2c3d", "2024-03-15", 0.94, 1100, "pending"
    ))
    manager.register_version(ModelVersion(
        "v3", "claude-3.5", "v3.0", "e4f5g6h", "2024-04-01", 0.91, 1050, "pending"
    ))

    manager.active_version = "v1"

    print("=== Model Version Manager ===\n")

    # Deploy v2 as canary
    print("1. Deploy v2 as canary (5% traffic):")
    result = manager.deploy_canary("v2", 5.0)
    print(f"   {result}")

    # Promote canary
    print("\n2. Promote v2 to active:")
    result = manager.promote_canary("v2")
    print(f"   {result}")

    # Deploy v3 as canary
    print("\n3. Deploy v3 as canary (5% traffic):")
    result = manager.deploy_canary("v3", 5.0)
    print(f"   {result}")

    # Simulate quality drop → rollback
    print("\n4. Quality detected → Rollback:")
    result = manager.rollback()
    print(f"   {result}")

    print(f"\n=== Deployment History ===")
    for entry in manager.get_deployment_history():
        print(f"  [{entry['timestamp']}] {entry['event']}: {entry.get('version', entry.get('from', ''))}")


if __name__ == "__main__":
    main()
