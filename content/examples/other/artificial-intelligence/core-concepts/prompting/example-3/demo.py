"""
Example 3: Structured Output Validator with Auto-Retry

Demonstrates:
- JSON Schema validation for LLM outputs
- Automatic retry with error feedback when validation fails
- Pydantic models for type-safe LLM response parsing
- Production pattern for reliable structured output
"""

from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional
import json


# Define expected output schema
class Finding(BaseModel):
    """A single code review finding."""
    severity: str = Field(
        ...,
        description="Must be one of: critical, high, medium, low",
        pattern="^(critical|high|medium|low)$"
    )
    category: str = Field(
        ...,
        description="Category: security, performance, quality, style"
    )
    line: int = Field(..., description="Line number in the code", gt=0)
    description: str = Field(..., min_length=10, max_length=500)
    suggestion: str = Field(..., min_length=10, max_length=500)


class CodeReviewResponse(BaseModel):
    """Complete code review response."""
    summary: str = Field(..., min_length=20, max_length=200)
    overall_risk: str = Field(..., pattern="^(low|medium|high|critical)$")
    findings: List[Finding] = Field(..., min_items=0, max_items=50)
    score: int = Field(..., ge=0, le=100)


# Simulated LLM responses
BROKEN_OUTPUTS = [
    # Missing required field
    '{"summary": "Review complete", "overall_risk": "medium", "findings": [{"severity": "high", "category": "security", "description": "SQL injection"}], "score": 65}',
    # Invalid enum value
    '{"summary": "Review complete", "overall_risk": "very_high", "findings": [], "score": 65}',
    # Score out of range
    '{"summary": "Review complete", "overall_risk": "medium", "findings": [], "score": 150}',
    # Invalid JSON
    '{"summary": "Review complete", "overall_risk": "medium", "findings": [}',
]

GOOD_OUTPUT = '''
{
    "summary": "The code has a critical SQL injection vulnerability in the login handler.",
    "overall_risk": "high",
    "findings": [
        {
            "severity": "critical",
            "category": "security",
            "line": 18,
            "description": "SQL injection vulnerability in get_user(). Raw string interpolation allows arbitrary SQL execution.",
            "suggestion": "Use parameterized queries: db.execute('SELECT * FROM users WHERE id = ?', (user_id,))"
        },
        {
            "severity": "medium",
            "category": "performance",
            "line": 25,
            "description": "N+1 query pattern in get_user_permissions(). Each permission triggers a separate database query.",
            "suggestion": "Use a JOIN query or prefetch: SELECT p.* FROM permissions p JOIN user_perms up ON p.id = up.perm_id WHERE up.user_id = ?"
        }
    ],
    "score": 35
}
'''


def validate_and_retry(llm_response: str, max_retries: int = 3) -> Optional[CodeReviewResponse]:
    """
    Validate LLM output against schema and retry with error feedback.
    In production, the retry would include the error message in a follow-up prompt.
    """
    errors_log = []

    for attempt in range(max_retries):
        try:
            # Parse JSON
            data = json.loads(llm_response)
            # Validate against schema
            validated = CodeReviewResponse(**data)
            return validated

        except json.JSONDecodeError as e:
            error_msg = f"JSON parse error: {str(e)}"
            errors_log.append(error_msg)
            print(f"  Attempt {attempt + 1}: {error_msg}")
            # In production: llm_response = call_llm(f"Fix the JSON: {error_msg}")

        except ValidationError as e:
            error_msg = f"Schema validation error: {e.error_count()} errors"
            errors_log.append(error_msg)
            print(f"  Attempt {attempt + 1}: {error_msg}")
            for error in e.errors():
                field = ".".join(str(loc) for loc in error["loc"])
                print(f"    - {field}: {error['msg']}")
            # In production: llm_response = call_llm(f"Fix the schema errors: {e.errors()}")

        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            errors_log.append(error_msg)
            print(f"  Attempt {attempt + 1}: {error_msg}")

    return None


def main():
    print("=== Structured Output Validation ===\n")

    # Test broken outputs
    print("--- Testing Broken Outputs ---")
    for i, broken in enumerate(BROKEN_OUTPUTS):
        print(f"\nTest {i + 1}: {broken[:80]}...")
        result = validate_and_retry(broken, max_retries=3)
        print(f"  Result: {'SUCCESS' if result else 'FAILED after 3 retries'}")

    # Test good output
    print(f"\n--- Testing Good Output ---")
    result = validate_and_retry(GOOD_OUTPUT)
    if result:
        print(f"  Summary: {result.summary}")
        print(f"  Risk: {result.overall_risk}")
        print(f"  Score: {result.score}/100")
        print(f"  Findings: {len(result.findings)}")
        for f in result.findings:
            print(f"    [{f.severity.upper()}] Line {f.line}: {f.category} - {f.description[:60]}...")


if __name__ == "__main__":
    main()
