"""
Example 3: Plug-In Quality Monitoring and Anomaly Detection

Demonstrates:
- Tracking tool call frequency, error rates, and resource usage
- Detecting anomalous plug-in behavior
- Quality scoring for plug-in marketplace
"""

from typing import Dict, List, Any
from dataclasses import dataclass, field
from datetime import datetime
from collections import defaultdict


@dataclass
class ToolCallRecord:
    plugin_id: str
    tool_name: str
    timestamp: str
    success: bool
    latency_ms: float
    error: str = ""


class PluginMonitor:
    """Monitors plug-in execution quality and detects anomalies."""

    def __init__(self):
        self.records: List[ToolCallRecord] = []
        self.anomaly_thresholds = {
            "error_rate": 0.2,  # 20% error rate triggers anomaly
            "avg_latency_ms": 5000,  # 5 seconds triggers anomaly
            "zero_usage_days": 7,  # 7 days without usage triggers review
        }

    def record_call(self, record: ToolCallRecord) -> None:
        self.records.append(record)

    def get_plugin_stats(self) -> Dict[str, Dict[str, Any]]:
        """Calculate quality metrics per plug-in."""
        stats: Dict[str, Dict] = defaultdict(lambda: {
            "total_calls": 0, "errors": 0, "latencies": [], "tools_called": set()
        })

        for r in self.records:
            s = stats[r.plugin_id]
            s["total_calls"] += 1
            if not r.success:
                s["errors"] += 1
            s["latencies"].append(r.latency_ms)
            s["tools_called"].add(r.tool_name)

        result = {}
        for plugin_id, s in stats.items():
            error_rate = s["errors"] / max(s["total_calls"], 1)
            avg_latency = sum(s["latencies"]) / max(len(s["latencies"]), 1)
            result[plugin_id] = {
                "total_calls": s["total_calls"],
                "error_rate": round(error_rate, 3),
                "avg_latency_ms": round(avg_latency, 1),
                "unique_tools_used": len(s["tools_called"]),
                "tools": list(s["tools_called"]),
            }
        return result

    def detect_anomalies(self) -> List[Dict[str, Any]]:
        """Detect anomalous plug-in behavior."""
        anomalies = []
        stats = self.get_plugin_stats()

        for plugin_id, s in stats.items():
            if s["error_rate"] > self.anomaly_thresholds["error_rate"]:
                anomalies.append({
                    "plugin_id": plugin_id,
                    "type": "high_error_rate",
                    "value": s["error_rate"],
                    "threshold": self.anomaly_thresholds["error_rate"],
                    "recommendation": "Investigate tool implementation or description clarity",
                })
            if s["avg_latency_ms"] > self.anomaly_thresholds["avg_latency_ms"]:
                anomalies.append({
                    "plugin_id": plugin_id,
                    "type": "high_latency",
                    "value": s["avg_latency_ms"],
                    "threshold": self.anomaly_thresholds["avg_latency_ms"],
                    "recommendation": "Optimize tool implementation or add timeout",
                })
            if s["total_calls"] == 0:
                anomalies.append({
                    "plugin_id": plugin_id,
                    "type": "zero_usage",
                    "value": 0,
                    "recommendation": "Review tool descriptions — LLM may not understand when to use them",
                })

        return anomalies

    def get_quality_report(self) -> Dict[str, Any]:
        """Generate comprehensive quality report."""
        return {
            "plugin_stats": self.get_plugin_stats(),
            "anomalies": self.detect_anomalies(),
            "total_records": len(self.records),
        }


def main():
    monitor = PluginMonitor()

    # Simulate call records
    calls = [
        ToolCallRecord("github", "search_repositories", "2024-01-01T10:00", True, 200),
        ToolCallRecord("github", "create_issue", "2024-01-01T10:01", True, 500),
        ToolCallRecord("github", "search_repositories", "2024-01-01T10:02", False, 100, "API timeout"),
        ToolCallRecord("database", "query_table", "2024-01-01T10:03", True, 50),
        ToolCallRecord("database", "query_table", "2024-01-01T10:04", True, 45),
        ToolCallRecord("database", "query_table", "2024-01-01T10:05", False, 30, "Table not found"),
        ToolCallRecord("web-search", "search_web", "2024-01-01T10:06", False, 6000, "Rate limited"),
        ToolCallRecord("web-search", "search_web", "2024-01-01T10:07", False, 5500, "Rate limited"),
        ToolCallRecord("web-search", "fetch_url", "2024-01-01T10:08", False, 7000, "Timeout"),
    ]

    for call in calls:
        monitor.record_call(call)

    print("=== Plug-In Quality Monitor ===\n")
    report = monitor.get_quality_report()

    print("Plugin Statistics:")
    for plugin_id, stats in report["plugin_stats"].items():
        print(f"\n  {plugin_id}:")
        print(f"    Calls: {stats['total_calls']}")
        print(f"    Error rate: {stats['error_rate']:.1%}")
        print(f"    Avg latency: {stats['avg_latency_ms']:.0f}ms")
        print(f"    Tools used: {stats['unique_tools_used']}")

    print(f"\nAnomalies Detected: {len(report['anomalies'])}")
    for anomaly in report["anomalies"]:
        print(f"\n  ⚠ {anomaly['plugin_id']}: {anomaly['type']}")
        print(f"    Value: {anomaly['value']}, Threshold: {anomaly.get('threshold', 'N/A')}")
        print(f"    Recommendation: {anomaly['recommendation']}")


if __name__ == "__main__":
    main()
