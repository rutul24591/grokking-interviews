"""
Example 1: AI Workflow Pipeline with Quality Gates

Demonstrates:
- Multi-step AI pipeline with validation at each stage
- Retry logic on validation failure
- Fallback paths when primary pipeline fails
- Structured error handling
"""

from typing import Dict, Any, Optional, List
from dataclasses import dataclass
import random


@dataclass
class PipelineResult:
    success: bool
    output: Any = None
    error: str = ""
    stage: str = ""
    retries: int = 0


class QualityGate:
    """Validates output at each pipeline stage."""

    @staticmethod
    def validate_format(output: str, expected_keys: List[str]) -> bool:
        """Check if output contains expected structure."""
        return all(key in output for key in expected_keys)

    @staticmethod
    def validate_length(output: str, min_len: int = 10, max_len: int = 5000) -> bool:
        """Check if output is within acceptable length."""
        return min_len <= len(output) <= max_len

    @staticmethod
    def validate_safety(output: str, blocked_terms: List[str]) -> bool:
        """Check for inappropriate content."""
        return not any(term in output.lower() for term in blocked_terms)


class AIWorkflowPipeline:
    """
    Production AI workflow with quality gates at each stage.
    """

    def __init__(self, max_retries: int = 2):
        self.max_retries = max_retries
        self.blocked_terms = ["hack", "exploit", "bypass"]
        self.execution_log: List[Dict] = []

    def _simulate_llm_call(self, prompt: str, temperature: float = 0.7) -> str:
        """Simulate LLM call with occasional failures."""
        if random.random() < 0.1:  # 10% failure rate
            raise TimeoutError("LLM API timeout")
        return f"Generated response for: {prompt[:50]}... with key insights and recommendations."

    def _run_stage(self, stage_name: str, func, *args, **kwargs) -> PipelineResult:
        """Run a pipeline stage with retry logic."""
        for attempt in range(self.max_retries + 1):
            try:
                result = func(*args, **kwargs)
                self.execution_log.append({
                    "stage": stage_name,
                    "status": "success",
                    "attempt": attempt + 1,
                })
                return PipelineResult(success=True, output=result, stage=stage_name, retries=attempt)
            except Exception as e:
                self.execution_log.append({
                    "stage": stage_name,
                    "status": "failed",
                    "attempt": attempt + 1,
                    "error": str(e),
                })
                if attempt < self.max_retries:
                    continue
                return PipelineResult(success=False, error=str(e), stage=stage_name, retries=attempt)

    def run(self, user_input: str) -> PipelineResult:
        """Execute the full AI workflow pipeline."""
        # Stage 1: Input validation
        if not user_input or len(user_input.strip()) < 5:
            return PipelineResult(success=False, error="Input too short", stage="input_validation")

        # Stage 2: Prompt construction
        prompt = f"Analyze the following and provide structured insights:\n\n{user_input}"
        prompt_result = self._run_stage("prompt_construction", lambda: prompt)
        if not prompt_result.success:
            return prompt_result

        # Stage 3: LLM call
        llm_result = self._run_stage("llm_call", self._simulate_llm_call, prompt_result.output)
        if not llm_result.success:
            # Fallback: use cached/simpler response
            fallback = f"Analysis of: {user_input[:50]}..."
            self.execution_log.append({"stage": "llm_call", "status": "fallback_used"})
            llm_result = PipelineResult(success=True, output=fallback, stage="llm_call")

        # Stage 4: Output validation
        output = llm_result.output
        if not QualityGate.validate_length(output):
            return PipelineResult(success=False, error="Output length invalid", stage="output_validation")

        if not QualityGate.validate_safety(output, self.blocked_terms):
            return PipelineResult(success=False, error="Safety check failed", stage="output_validation")

        # Stage 5: Format and deliver
        formatted = {"analysis": output, "timestamp": "2024-01-01", "confidence": 0.85}
        return PipelineResult(success=True, output=formatted, stage="delivery")


def main():
    pipeline = AIWorkflowPipeline(max_retries=2)

    test_inputs = [
        "Analyze the market trends for cloud computing in 2024",
        "Short",  # Too short → validation fail
        "Compare microservices vs monolith architecture for a startup",
    ]

    print("=== AI Workflow Pipeline Demo ===\n")

    for i, input_text in enumerate(test_inputs, 1):
        print(f"Input {i}: '{input_text}'")
        result = pipeline.run(input_text)
        print(f"  Success: {result.success}")
        print(f"  Stage reached: {result.stage}")
        if result.error:
            print(f"  Error: {result.error}")
        if result.output and result.success:
            output_str = str(result.output)[:80]
            print(f"  Output: {output_str}...")
        print()

    print(f"=== Execution Log ===")
    for entry in pipeline.execution_log:
        print(f"  {entry['stage']}: {entry['status']} (attempt {entry['attempt']})")


if __name__ == "__main__":
    random.seed(42)  # Reproducible results
    main()
