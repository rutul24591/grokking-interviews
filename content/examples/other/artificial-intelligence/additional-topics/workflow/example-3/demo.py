"""
Example 3: Benchmark Dataset Management for AI Evaluation

Demonstrates:
- Creating and versioning evaluation datasets
- Running benchmark tests on prompt/model changes
- Detecting quality regressions
- Dataset augmentation from production edge cases
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime
import json


@dataclass
class BenchmarkExample:
    input_text: str
    expected_output: str
    category: str
    difficulty: str  # "easy", "medium", "hard"
    added_date: str = ""
    source: str = "manual"  # "manual", "production", "edge_case"

    def __post_init__(self):
        if not self.added_date:
            self.added_date = datetime.now().isoformat()


@dataclass
class BenchmarkResult:
    example: BenchmarkExample
    actual_output: str
    score: float  # 0.0-1.0
    passed: bool
    failure_reason: str = ""


class BenchmarkDataset:
    """Manages evaluation datasets for AI workflow testing."""

    def __init__(self, name: str, version: str = "1.0.0"):
        self.name = name
        self.version = version
        self.examples: List[BenchmarkExample] = []
        self.results: List[BenchmarkResult] = []

    def add_example(self, example: BenchmarkExample) -> None:
        self.examples.append(example)

    def add_from_production(self, input_text: str, correct_output: str, category: str, difficulty: str) -> None:
        """Augment dataset from production edge cases."""
        example = BenchmarkExample(
            input_text=input_text,
            expected_output=correct_output,
            category=category,
            difficulty=difficulty,
            source="production",
        )
        self.add_example(example)

    def run_benchmark(self, generate_fn) -> List[BenchmarkResult]:
        """Run benchmark against a generate function (prompt/model)."""
        self.results = []
        for example in self.examples:
            try:
                actual = generate_fn(example.input_text)
                # Simple similarity score (in production, use embedding similarity or LLM judge)
                input_words = set(example.input_text.lower().split())
                output_words = set(actual.lower().split())
                expected_words = set(example.expected_output.lower().split())

                # Score based on overlap with expected output
                if expected_words:
                    score = len(output_words & expected_words) / len(expected_words)
                else:
                    score = 0.0

                passed = score >= 0.3  # Threshold for "acceptable"
                self.results.append(BenchmarkResult(
                    example=example,
                    actual_output=actual,
                    score=round(score, 3),
                    passed=passed,
                ))
            except Exception as e:
                self.results.append(BenchmarkResult(
                    example=example,
                    actual_output="",
                    score=0.0,
                    passed=False,
                    failure_reason=str(e),
                ))
        return self.results

    def get_report(self) -> Dict[str, Any]:
        """Generate benchmark report."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        avg_score = sum(r.score for r in self.results) / max(total, 1)

        # Per-category breakdown
        by_category: Dict[str, Dict] = {}
        for r in self.results:
            cat = r.example.category
            if cat not in by_category:
                by_category[cat] = {"total": 0, "passed": 0, "scores": []}
            by_category[cat]["total"] += 1
            if r.passed:
                by_category[cat]["passed"] += 1
            by_category[cat]["scores"].append(r.score)

        for cat in by_category:
            scores = by_category[cat]["scores"]
            by_category[cat]["avg_score"] = round(sum(scores) / len(scores), 3)
            by_category[cat]["pass_rate"] = f"{by_category[cat]['passed'] / by_category[cat]['total'] * 100:.0f}%"
            del by_category[cat]["scores"]

        return {
            "dataset": self.name,
            "version": self.version,
            "total_examples": len(self.examples),
            "passed": passed,
            "failed": total - passed,
            "pass_rate": f"{passed / max(total, 1) * 100:.0f}%",
            "avg_score": round(avg_score, 3),
            "by_category": by_category,
        }


def main():
    dataset = BenchmarkDataset("customer_support_eval", "1.0.0")

    # Seed with manual examples
    dataset.add_example(BenchmarkExample(
        input_text="How do I reset my password?",
        expected_output="Go to settings, click Security, and select Reset Password",
        category="account",
        difficulty="easy",
    ))
    dataset.add_example(BenchmarkExample(
        input_text="I was charged twice for my subscription",
        expected_output="I will look into your billing history and process a refund if duplicate charges are found",
        category="billing",
        difficulty="medium",
    ))
    dataset.add_example(BenchmarkExample(
        input_text="Compare your enterprise plan with competitors",
        expected_output="Our enterprise plan includes SSO, custom integrations, dedicated support, and SLA guarantees",
        category="sales",
        difficulty="hard",
    ))

    # Simulated generate function
    def simulate_generate(input_text: str) -> str:
        responses = {
            "password": "Go to settings and click Reset Password. You will receive an email.",
            "charged": "I see the duplicate charge. Processing refund now.",
            "enterprise": "Our enterprise plan offers SSO, integrations, and support.",
        }
        for key, response in responses.items():
            if key in input_text.lower():
                return response
        return "I'm not sure how to help with that."

    # Run benchmark
    dataset.run_benchmark(simulate_generate)
    report = dataset.get_report()

    print("=== Benchmark Dataset Management ===\n")
    print(f"Dataset: {report['dataset']} v{report['version']}")
    print(f"Examples: {report['total_examples']}")
    print(f"Pass rate: {report['pass_rate']}")
    print(f"Avg score: {report['avg_score']}")
    print(f"\nBy Category:")
    for cat, stats in report["by_category"].items():
        print(f"  {cat}: {stats['pass_rate']} pass rate, avg score {stats['avg_score']}")

    # Augment from production
    dataset.add_from_production(
        input_text="API rate limit exceeded",
        correct_output="Your current plan allows 1000 requests per minute. Consider upgrading.",
        category="technical",
        difficulty="medium",
    )
    print(f"\nDataset augmented: {len(dataset.examples)} examples (added from production edge case)")


if __name__ == "__main__":
    main()
