# Example 2: Data Loss Prevention (DLP) Scanner for AI Systems

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`re`, `typing`, `dataclasses`).

## What This Demonstrates

This example implements a Data Loss Prevention (DLP) scanner that detects and redacts sensitive data patterns before they enter or exit an AI system. It covers PII (emails, phone numbers, SSNs), financial data (credit cards), and credentials (API keys, AWS keys, passwords). The scanner classifies risk levels and produces redacted versions of text, making it suitable for both input sanitization and output filtering in production AI pipelines.

## Code Walkthrough

### Key Classes

**`DLPFinding`** — A dataclass representing a single detection with fields for `category` (PII, Financial, Credential), `pattern` name, `matched_text` (truncated to 30 chars), `position` in the source text, and `severity` (critical, high, medium, low).

**`DLPScanner`** — The core scanner with three class methods:

**`scan(text)`** — Iterates through seven regex patterns and returns a list of `DLPFinding` objects:
- **Email** — Standard email format matching (`high` severity, PII category)
- **Phone** — US phone number formats including with/without country code (`high`, PII)
- **SSN** — Exact SSN pattern `XXX-XX-XX` (`critical`, PII)
- **Credit card** — 16-digit card numbers with optional separators (`critical`, Financial)
- **API key** — Key-value patterns with 20+ character values (`critical`, Credential)
- **AWS key** — AWS access key IDs starting with `AKIA` followed by 16 characters (`critical`, Credential)
- **Password** — Password/key-value assignments (`critical`, Credential)

**`redact(text)`** — Replaces all matched patterns with `[REDACTED:PATTERN_NAME]` placeholders. Processes all seven patterns sequentially, producing a safe version of the input suitable for logging or display.

**`classify_risk(findings)`** — Maps a list of findings to an overall risk level:
- `"safe"` — No findings
- `"blocked"` — Any critical severity finding (SSN, credit card, credentials)
- `"review"` — High severity findings only (email, phone)
- `"warn"` — Lower severity findings

### Execution Flow (from `main()`)

1. Five test texts are processed, ranging from safe content to texts containing emails, phone numbers, SSNs, and AWS keys.
2. For each text, `DLPScanner.scan()` identifies all matching patterns.
3. `DLPScanner.classify_risk()` determines the overall risk level.
4. If findings exist, each finding's severity, category, pattern name, and matched text are printed, followed by the fully redacted version of the original text.

## Key Takeaways

- **DLP is mandatory for production AI systems** — AI models can inadvertently memorize and reproduce sensitive data from training; scanning both inputs and outputs prevents data exfiltration.
- **Severity-based classification drives automated response** — Critical findings should block the request entirely, high-severity findings should trigger human review, and lower findings may generate warnings.
- **Redaction enables safe logging** — Redacted versions of text can be safely stored in logs, audit trails, and analytics without exposing PII or credentials.
- **Pattern coverage matters** — The scanner covers three distinct data categories (PII, Financial, Credential) with seven specific patterns, but production systems should expand this to include additional jurisdiction-specific patterns (e.g., EU national ID numbers).
- **Both input and output scanning are needed** — Input scanning prevents sensitive data from reaching the model; output scanning catches any data the model might generate or leak.
