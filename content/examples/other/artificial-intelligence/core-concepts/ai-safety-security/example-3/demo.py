"""
Example 3: AI Security Audit Log and Incident Tracker

Demonstrates:
- Comprehensive audit logging for all AI interactions
- Security event detection and alerting
- Incident tracking and response workflow
- Compliance reporting
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import json


class EventType(Enum):
    INPUT_RECEIVED = "input_received"
    PROMPT_BUILT = "prompt_built"
    MODEL_CALLED = "model_called"
    OUTPUT_GENERATED = "output_generated"
    INJECTION_DETECTED = "injection_detected"
    OUTPUT_BLOCKED = "output_blocked"
    PERMISSION_DENIED = "permission_denied"
    TOOL_CALL_MADE = "tool_call_made"
    ERROR_OCCURRED = "error_occurred"


class Severity(Enum):
    INFO = "info"
    WARNING = "warning"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class AuditEntry:
    timestamp: str
    event_type: EventType
    severity: Severity
    session_id: str
    user_id: str
    details: Dict[str, Any]
    metadata: Dict[str, Any] = field(default_factory=dict)


class AuditLogger:
    """Comprehensive audit logger for AI systems."""

    def __init__(self):
        self.entries: List[AuditEntry] = []
        self.alert_thresholds = {
            Severity.CRITICAL: 1,  # Alert immediately
            Severity.HIGH: 5,      # Alert after 5 in 1 hour
            Severity.WARNING: 20,  # Alert after 20 in 1 hour
        }

    def log(self, event_type: EventType, severity: Severity,
            session_id: str, user_id: str, details: Dict) -> None:
        """Log a security event."""
        entry = AuditEntry(
            timestamp=datetime.now().isoformat(),
            event_type=event_type,
            severity=severity,
            session_id=session_id,
            user_id=user_id,
            details=details,
        )
        self.entries.append(entry)

    def get_session_trace(self, session_id: str) -> List[Dict]:
        """Get full audit trail for a session."""
        return [
            {
                "timestamp": e.timestamp,
                "event": e.event_type.value,
                "severity": e.severity.value,
                "details": e.details,
            }
            for e in self.entries
            if e.session_id == session_id
        ]

    def get_security_report(self, hours: int = 24) -> Dict[str, Any]:
        """Generate security report for the specified time window."""
        cutoff = datetime.now().isoformat()  # Simplified
        entries = self.entries  # In production, filter by time

        by_severity = {}
        by_type = {}
        critical_events = []

        for e in entries:
            sev = e.severity.value
            by_severity[sev] = by_severity.get(sev, 0) + 1

            evt = e.event_type.value
            by_type[evt] = by_type.get(evt, 0) + 1

            if e.severity in (Severity.CRITICAL, Severity.HIGH):
                critical_events.append({
                    "timestamp": e.timestamp,
                    "event": evt,
                    "user": e.user_id,
                    "details": e.details,
                })

        return {
            "total_events": len(entries),
            "by_severity": by_severity,
            "by_type": by_type,
            "critical_events": critical_events[-10:],  # Last 10
        }


def main():
    logger = AuditLogger()

    # Simulate audit trail
    logger.log(EventType.INPUT_RECEIVED, Severity.INFO,
               "sess-1", "user-123", {"input_length": 150})
    logger.log(EventType.PROMPT_BUILT, Severity.INFO,
               "sess-1", "user-123", {"template": "rag_qa"})
    logger.log(EventType.MODEL_CALLED, Severity.INFO,
               "sess-1", "user-123", {"model": "gpt-4", "tokens": 2500})
    logger.log(EventType.INJECTION_DETECTED, Severity.HIGH,
               "sess-2", "user-456", {"pattern": "ignore_previous_instructions"})
    logger.log(EventType.OUTPUT_BLOCKED, Severity.HIGH,
               "sess-2", "user-456", {"reason": "content_policy_violation"})
    logger.log(EventType.PERMISSION_DENIED, Severity.CRITICAL,
               "sess-3", "user-789", {"attempted": "read_admin_db", "granted": ["read_public"]})
    logger.log(EventType.OUTPUT_GENERATED, Severity.INFO,
               "sess-1", "user-123", {"output_length": 500})

    print("=== AI Security Audit Log ===\n")
    report = logger.get_security_report()

    print(f"Total events: {report['total_events']}")
    print(f"By severity: {report['by_severity']}")
    print(f"By type: {report['by_type']}")

    print(f"\nCritical/High Events:")
    for event in report["critical_events"]:
        print(f"  [{event['timestamp']}] {event['event']}")
        print(f"    User: {event['user']}, Details: {event['details']}")

    print(f"\nSession Trace (sess-1):")
    trace = logger.get_session_trace("sess-1")
    for entry in trace:
        print(f"  {entry['timestamp']} - {entry['event']} ({entry['severity']})")


if __name__ == "__main__":
    main()
