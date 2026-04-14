"""
Example 1: Golden Dataset Evaluation with RAGAS-inspired Metrics

Demonstrates:
- Evaluating AI outputs against golden dataset examples
- Scoring faithfulness, relevance, and safety
- Detecting regressions compared to baseline scores
- Pass/fail verdict for CI/CD quality gates
"""

from typing import List, Dict, Any
from dataclasses import dataclass
import json


@dataclass
class GoldenExample:
    id: str
    input_text: str
    expected_output: str
    category: str
    difficulty: str


@dataclass
class EvalResult:
    example_id: str
    faithfulness: float
    relevance: float
    safety: float
    overall: float
    passed: bool


class GoldenDatasetEvaluator:
    """Evaluates AI system outputs against a golden dataset."""

    def __init__(self, baseline_scores: Dict[str, float] = None):
        self.baseline = baseline_scores or {
            "faithfulness": 0.88,
            "relevance": 0.85,
            "safety": 0.97,
            "overall": 0.87,
        }
        self.regression_threshold = 0.03  # 3% drop triggers regression

    def score_output(self, expected: str, actual: str) -> Dict[str, float]:
        """Score an output against expected (simulated evaluation)."""
        expected_words = set(expected.lower().split())
        actual_words = set(actual.lower().split())

        # Faithfulness: how much of actual is supported by expected
        overlap = len(expected_words & actual_words)
        faithfulness = overlap / max(len(actual_words), 1)

        # Relevance: how much of expected is covered by actual
        relevance = overlap / max(len(expected_words), 1)

        # Safety: check for problematic patterns (simulated)
        safety = 0.95 if not any(w in actual.lower() for w in ["hack", "exploit"]) else 0.5

        overall = (faithfulness * 0.4 + relevance * 0.4 + safety * 0.2)

        return {
            "faithfulness": round(min(faithfulness, 1.0), 3),
            "relevance": round(min(relevance, 1.0), 3),
            "safety": round(safety, 3),
            "overall": round(overall, 3),
        }

    def evaluate(self, examples: List[GoldenExample], generate_fn) -> List[EvalResult]:
        """Evaluate all golden examples."""
        results = []
        for ex in examples:
            actual = generate_fn(ex.input_text)
            scores = self.score_output(ex.expected_output, actual)
            passed = scores["overall"] >= 0.6  # Minimum acceptable score
            results.append(EvalResult(
                example_id=ex.id,
                **scores,
                passed=passed,
            ))
        return results

    def compare_vs_baseline(self, results: List[EvalResult]) -> Dict[str, Any]:
        """Compare current scores against baseline."""
        if not results:
            return {"verdict": "NO_DATA"}

        avg_scores = {
            "faithfulness": sum(r.faithfulness for r in results) / len(results),
            "relevance": sum(r.relevance for r in results) / len(results),
            "safety": sum(r.safety for r in results) / len(results),
            "overall": sum(r.overall for r in results) / len(results),
        }

        # Detect regressions
        regressions = {}
        for metric, current in avg_scores.items():
            delta = current - self.baseline.get(metric, 0)
            if delta < -self.regression_threshold:
                regressions[metric] = round(delta, 3)

        verdict = "REGRESSION" if regressions else "PASS"

        return {
            "current_scores": {k: round(v, 3) for k, v in avg_scores.items()},
            "baseline_scores": self.baseline,
            "deltas": {k: round(avg_scores[k] - self.baseline.get(k, 0), 3) for k in avg_scores},
            "regressions": regressions,
            "verdict": verdict,
            "examples_evaluated": len(results),
            "examples_passed": sum(1 for r in results if r.passed),
        }


def main():
    evaluator = GoldenDatasetEvaluator()

    golden_examples = [
        GoldenExample("ex-1", "What is OAuth?", "OAuth is an authorization framework...", "factual", "easy"),
        GoldenExample("ex-2", "Analyze Q3 trends", "Q3 revenue grew 15% with margins expanding...", "analysis", "medium"),
        GoldenExample("ex-3", "Compare architectures", "Microservices offer scalability but add complexity...", "comparison", "hard"),
    ]

    def simulate_generate(input_text: str) -> str:
        responses = {
            "What is OAuth?": "OAuth is an authorization framework for delegated access.",
            "Analyze Q3 trends": "Q3 revenue grew 15% year-over-year with margins at 28%.",
            "Compare architectures": "Microservices scale independently but add operational overhead.",
        }
        return responses.get(input_text, "No response available.")

    results = evaluator.evaluate(golden_examples, simulate_generate)
    report = evaluator.compare_vs_baseline(results)

    print("=== Golden Dataset Evaluation ===\n")
    print(f"Examples evaluated: {report['examples_evaluated']}")
    print(f"Examples passed: {report['examples_passed']}")
    print(f"\nCurrent Scores vs Baseline:")
    for metric in ["faithfulness", "relevance", "safety", "overall"]:
        current = report["current_scores"][metric]
        baseline = report["baseline_scores"][metric]
        delta = report["deltas"][metric]
        direction = "↑" if delta > 0 else "↓" if delta < 0 else "→"
        print(f"  {metric}: {current:.3f} {direction} (baseline: {baseline:.3f}, Δ {delta:+.3f})")

    print(f"\nVERDICT: {report['verdict']}")
    if report["regressions"]:
        print("Regressions detected:")
        for metric, delta in report["regressions"].items():
            print(f"  {metric}: {delta:.3f} below threshold")


if __name__ == "__main__":
    main()
