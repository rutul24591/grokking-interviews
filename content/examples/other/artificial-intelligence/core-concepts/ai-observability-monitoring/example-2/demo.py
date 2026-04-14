"""
Example 2: AI Quality Drift Detection

Demonstrates:
- Tracking quality metrics over time
- Detecting statistical drift in output quality
- Alerting when quality drops below baseline
- Root cause analysis for quality changes
"""

from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
import math


@dataclass
class QualitySnapshot:
    timestamp: str
    accuracy: float
    helpfulness: float
    safety: float
    overall: float


class QualityDriftDetector:
    """Detects quality drift in AI system outputs over time."""

    def __init__(
        self,
        baseline_window_hours: int = 168,  # 1 week
        detection_window_hours: int = 24,
        alert_threshold: float = 0.05,  # 5% drop
        critical_threshold: float = 0.10,  # 10% drop
    ):
        self.baseline_window = timedelta(hours=baseline_window_hours)
        self.detection_window = timedelta(hours=detection_window_hours)
        self.alert_threshold = alert_threshold
        self.critical_threshold = critical_threshold
        self.snapshots: List[QualitySnapshot] = []

    def add_snapshot(self, snapshot: QualitySnapshot) -> None:
        self.snapshots.append(snapshot)

    def _get_baseline_avg(self) -> Dict[str, float]:
        """Calculate average quality over baseline window."""
        now = datetime.now()
        baseline_start = now - self.baseline_window
        relevant = [
            s for s in self.snapshots
            if datetime.fromisoformat(s.timestamp) >= baseline_start
        ]
        if not relevant:
            return {"accuracy": 0, "helpfulness": 0, "safety": 0, "overall": 0}

        return {
            "accuracy": sum(s.accuracy for s in relevant) / len(relevant),
            "helpfulness": sum(s.helpfulness for s in relevant) / len(relevant),
            "safety": sum(s.safety for s in relevant) / len(relevant),
            "overall": sum(s.overall for s in relevant) / len(relevant),
        }

    def _get_current_avg(self) -> Dict[str, float]:
        """Calculate average quality over detection window."""
        now = datetime.now()
        detection_start = now - self.detection_window
        relevant = [
            s for s in self.snapshots
            if datetime.fromisoformat(s.timestamp) >= detection_start
        ]
        if not relevant:
            return {"accuracy": 0, "helpfulness": 0, "safety": 0, "overall": 0}

        return {
            "accuracy": sum(s.accuracy for s in relevant) / len(relevant),
            "helpfulness": sum(s.helpfulness for s in relevant) / len(relevant),
            "safety": sum(s.safety for s in relevant) / len(relevant),
            "overall": sum(s.overall for s in relevant) / len(relevant),
        }

    def detect_drift(self) -> Dict[str, Any]:
        """Detect quality drift and generate alerts."""
        baseline = self._get_baseline_avg()
        current = self._get_current_avg()

        deltas = {}
        alerts = []
        for metric in ["accuracy", "helpfulness", "safety", "overall"]:
            delta = current[metric] - baseline[metric]
            deltas[metric] = round(delta, 4)

            if delta < -self.critical_threshold:
                alerts.append({
                    "metric": metric,
                    "severity": "CRITICAL",
                    "delta": round(delta, 4),
                    "baseline": round(baseline[metric], 4),
                    "current": round(current[metric], 4),
                    "action": "Immediate investigation required",
                })
            elif delta < -self.alert_threshold:
                alerts.append({
                    "metric": metric,
                    "severity": "WARNING",
                    "delta": round(delta, 4),
                    "baseline": round(baseline[metric], 4),
                    "current": round(current[metric], 4),
                    "action": "Monitor closely, prepare rollback",
                })

        return {
            "baseline": {k: round(v, 4) for k, v in baseline.items()},
            "current": {k: round(v, 4) for k, v in current.items()},
            "deltas": deltas,
            "alerts": alerts,
            "status": "ALERT" if alerts else "OK",
        }


def main():
    detector = QualityDriftDetector(
        baseline_window_hours=168,  # 1 week baseline
        detection_window_hours=24,  # 24h detection window
        alert_threshold=0.03,
        critical_threshold=0.06,
    )

    now = datetime.now()

    # Generate baseline snapshots (stable quality)
    for i in range(168):  # 168 hours = 1 week
        ts = (now - timedelta(hours=168 - i)).isoformat()
        detector.add_snapshot(QualitySnapshot(
            timestamp=ts,
            accuracy=0.92 + (i % 5) * 0.005,
            helpfulness=0.88 + (i % 4) * 0.005,
            safety=0.97 + (i % 3) * 0.003,
            overall=0.90 + (i % 6) * 0.004,
        ))

    # Generate recent snapshots (quality dropping)
    for i in range(24):
        ts = (now - timedelta(hours=24 - i)).isoformat()
        # Simulating quality drop in recent hours
        drop = i * 0.004
        detector.add_snapshot(QualitySnapshot(
            timestamp=ts,
            accuracy=0.92 - drop,
            helpfulness=0.88 - drop * 0.8,
            safety=0.97 - drop * 0.3,
            overall=0.90 - drop * 0.7,
        ))

    print("=== AI Quality Drift Detection ===\n")
    result = detector.detect_drift()

    print(f"Status: {result['status']}\n")
    print(f"Baseline (1 week avg) → Current (24h avg) → Delta")
    for metric in ["accuracy", "helpfulness", "safety", "overall"]:
        b = result["baseline"][metric]
        c = result["current"][metric]
        d = result["deltas"][metric]
        direction = "↓" if d < 0 else "↑"
        print(f"  {metric:12s}: {b:.4f} → {c:.4f} ({direction} {abs(d):.4f})")

    if result["alerts"]:
        print(f"\n{'='*50}")
        print(f"ALERTS ({len(result['alerts'])}):")
        for alert in result["alerts"]:
            print(f"  [{alert['severity']}] {alert['metric']}: {alert['delta']:+.4f}")
            print(f"    Baseline: {alert['baseline']:.4f} → Current: {alert['current']:.4f}")
            print(f"    Action: {alert['action']}")
    else:
        print("\n✓ No quality drift detected")


if __name__ == "__main__":
    main()
