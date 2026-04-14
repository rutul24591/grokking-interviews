"""
Example 2: Data Loss Prevention (DLP) Scanner for AI Systems

Demonstrates:
- Scanning input and output for sensitive data patterns
- PII detection and redaction
- Credential detection and blocking
- Data classification before model processing
"""

from typing import List, Dict, Optional
import re
from dataclasses import dataclass


@dataclass
class DLPFinding:
    category: str
    pattern: str
    matched_text: str
    position: int
    severity: str  # "critical", "high", "medium", "low"


class DLPScanner:
    """Data Loss Prevention scanner for AI systems."""

    PATTERNS = {
        "email": {
            "regex": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
            "severity": "high",
            "category": "PII",
        },
        "phone": {
            "regex": r"\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b",
            "severity": "high",
            "category": "PII",
        },
        "ssn": {
            "regex": r"\b\d{3}-\d{2}-\d{4}\b",
            "severity": "critical",
            "category": "PII",
        },
        "credit_card": {
            "regex": r"\b(?:\d{4}[-\s]?){3}\d{4}\b",
            "severity": "critical",
            "category": "Financial",
        },
        "api_key": {
            "regex": r"(?:api[_-]?key|apikey|access[_-]?token)\s*[:=]\s*['\"]?[\w-]{20,}",
            "severity": "critical",
            "category": "Credential",
        },
        "aws_key": {
            "regex": r"AKIA[0-9A-Z]{16}",
            "severity": "critical",
            "category": "Credential",
        },
        "password": {
            "regex": r"(?:password|passwd|pwd)\s*[:=]\s*\S+",
            "severity": "critical",
            "category": "Credential",
        },
    }

    @classmethod
    def scan(cls, text: str) -> List[DLPFinding]:
        """Scan text for sensitive data patterns."""
        findings = []
        for name, config in cls.PATTERNS.items():
            for match in re.finditer(config["regex"], text):
                findings.append(DLPFinding(
                    category=config["category"],
                    pattern=name,
                    matched_text=match.group()[:30],
                    position=match.start(),
                    severity=config["severity"],
                ))
        return findings

    @classmethod
    def redact(cls, text: str) -> str:
        """Redact sensitive data from text."""
        redacted = text
        for name, config in cls.PATTERNS.items():
            redacted = re.sub(config["regex"], f"[REDACTED:{name.upper()}]", redacted)
        return redacted

    @classmethod
    def classify_risk(cls, findings: List[DLPFinding]) -> str:
        """Classify overall risk level based on findings."""
        if not findings:
            return "safe"
        severities = [f.severity for f in findings]
        if "critical" in severities:
            return "blocked"
        if "high" in severities:
            return "review"
        return "warn"


def main():
    test_texts = [
        "Please analyze this customer feedback: Great product!",
        "Contact me at john.doe@company.com or call 555-123-4567",
        "My SSN is 123-45-6789 and my API key is sk-abc123def456",
        "AWS access key: AKIAIOSFODNN7EXAMPLE",
        "The quarterly revenue was $4.2B with 15% growth",
    ]

    print("=== DLP Scanner Demo ===\n")

    for i, text in enumerate(test_texts, 1):
        print(f"Text {i}: '{text[:60]}...'")
        findings = DLPScanner.scan(text)
        risk = DLPScanner.classify_risk(findings)

        if findings:
            print(f"  Risk: {risk.upper()}")
            for f in findings:
                print(f"    [{f.severity.upper()}] {f.category}/{f.pattern}: {f.matched_text}")
            redacted = DLPScanner.redact(text)
            print(f"  Redacted: {redacted}")
        else:
            print(f"  Risk: SAFE")
        print()


if __name__ == "__main__":
    main()
