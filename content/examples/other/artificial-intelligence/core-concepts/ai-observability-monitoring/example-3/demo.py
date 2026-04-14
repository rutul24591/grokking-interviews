"""
Example 3: Cost Anomaly Detection for AI Systems

Demonstrates:
- Tracking per-request costs over time
- Detecting cost spikes using statistical methods
- Identifying root causes of cost anomalies
- Automated alerting and cost budget enforcement
"""

from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
import math


@dataclass
class CostRecord:
    timestamp: str
    model: str
    input_tokens: int
    output_tokens: int
    cost: float
    feature: str
    user_id: str


class CostAnomalyDetector:
    """Detects cost anomalies in AI system spending."""

    def __init__(
        self,
        window_size: int = 100,  # Rolling window
        z_threshold: float = 3.0,  # Standard deviations for anomaly
    ):
        self.window_size = window_size
        self.z_threshold = z_threshold
        self.records: List[CostRecord] = []
        self.alerts: List[Dict] = []

    def add_record(self, record: CostRecord) -> None:
        self.records.append(record)
        self._check_anomaly(record)

    def _get_rolling_stats(self, feature: str) -> Dict[str, float]:
        """Calculate rolling mean and std of cost per feature."""
        feature_records = [
            r for r in self.records[-self.window_size:]
            if r.feature == feature
        ]
        if len(feature_records) < 10:
            return {"mean": 0, "std": 0, "count": 0}

        costs = [r.cost for r in feature_records]
        mean = sum(costs) / len(costs)
        variance = sum((c - mean) ** 2 for c in costs) / len(costs)
        std = math.sqrt(variance)

        return {"mean": round(mean, 6), "std": round(std, 6), "count": len(costs)}

    def _check_anomaly(self, record: CostRecord) -> None:
        """Check if a cost record is anomalous."""
        stats = self._get_rolling_stats(record.feature)
        if stats["std"] == 0 or stats["count"] < 10:
            return

        z_score = (record.cost - stats["mean"]) / stats["std"]

        if z_score > self.z_threshold:
            alert = {
                "timestamp": record.timestamp,
                "feature": record.feature,
                "model": record.model,
                "user_id": record.user_id,
                "cost": record.cost,
                "baseline_mean": stats["mean"],
                "baseline_std": stats["std"],
                "z_score": round(z_score, 2),
                "severity": "HIGH" if z_score > 5 else "MEDIUM",
            }
            self.alerts.append(alert)

    def get_summary(self) -> Dict[str, Any]:
        """Get cost summary and anomaly report."""
        total_cost = sum(r.cost for r in self.records)
        avg_cost = total_cost / max(len(self.records), 1)

        by_feature = {}
        for r in self.records:
            if r.feature not in by_feature:
                by_feature[r.feature] = {"cost": 0, "count": 0}
            by_feature[r.feature]["cost"] += r.cost
            by_feature[r.feature]["count"] += 1

        for f in by_feature:
            by_feature[f]["avg_cost"] = round(
                by_feature[f]["cost"] / by_feature[f]["count"], 6
            )

        return {
            "total_records": len(self.records),
            "total_cost": round(total_cost, 4),
            "avg_cost_per_request": round(avg_cost, 6),
            "by_feature": {k: {kk: round(vv, 4) if isinstance(vv, float) else vv for kk, vv in v.items()} for k, v in by_feature.items()},
            "anomalies_detected": len(self.alerts),
            "recent_alerts": self.alerts[-5:],
        }


def main():
    detector = CostAnomalyDetector(window_size=100, z_threshold=3.0)

    # Simulate normal cost records
    for i in range(80):
        ts = (datetime.now() - timedelta(minutes=80 - i)).isoformat()
        detector.add_record(CostRecord(
            timestamp=ts,
            model="gpt-4",
            input_tokens=2500,
            output_tokens=350,
            cost=0.00975 + (i % 10) * 0.0005,  # Normal variation
            feature="customer_support",
            user_id=f"user-{i % 20}",
        ))

    # Simulate cost spike (anomaly)
    for i in range(5):
        ts = (datetime.now() - timedelta(minutes=5 - i)).isoformat()
        detector.add_record(CostRecord(
            timestamp=ts,
            model="gpt-4",
            input_tokens=15000,  # Much larger input
            output_tokens=2000,  # Much larger output
            cost=0.065,  # 6x normal cost
            feature="customer_support",
            user_id="user-anomaly",
        ))

    print("=== AI Cost Anomaly Detection ===\n")
    summary = detector.get_summary()

    print(f"Total records: {summary['total_records']}")
    print(f"Total cost: ${summary['total_cost']:.4f}")
    print(f"Avg cost/request: ${summary['avg_cost_per_request']:.6f}")

    print(f"\nCost by Feature:")
    for feature, stats in summary["by_feature"].items():
        print(f"  {feature}: ${stats['cost']:.4f} ({stats['count']} requests, avg ${stats['avg_cost']:.6f})")

    print(f"\nAnomalies Detected: {summary['anomalies_detected']}")
    for alert in summary["recent_alerts"]:
        print(f"  [{alert['severity']}] {alert['feature']}: cost=${alert['cost']:.4f} (baseline=${alert['baseline_mean']:.6f}, z={alert['z_score']:.1f})")
        print(f"    User: {alert['user_id']}, Model: {alert['model']}")


if __name__ == "__main__":
    main()
