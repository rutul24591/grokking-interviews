"""
Example 3: A/B Test Analyzer for Model Comparison

Demonstrates:
- Statistical significance testing for A/B test results
- Determining when to stop the test and declare a winner
- Sample size calculation for desired power
"""

import math
from typing import Dict, List, Any
from dataclasses import dataclass


def z_test_proportions(p1: float, n1: int, p2: float, n2: int) -> Dict[str, float]:
    """Two-proportion z-test for statistical significance."""
    p_pool = (p1 * n1 + p2 * n2) / (n1 + n2)
    se = math.sqrt(p_pool * (1 - p_pool) * (1/n1 + 1/n2))
    if se == 0:
        return {"z_score": 0, "p_value": 1.0, "significant": False}

    z = (p1 - p2) / se
    # Approximate p-value from z-score (two-tailed)
    p_value = 2 * (1 - _normal_cdf(abs(z)))

    return {
        "z_score": round(z, 3),
        "p_value": round(p_value, 4),
        "significant": p_value < 0.05,
    }


def _normal_cdf(x: float) -> float:
    """Approximation of standard normal CDF."""
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def required_sample_size(baseline_rate: float, mde: float, alpha: float = 0.05, power: float = 0.80) -> int:
    """Calculate required sample size per variant."""
    z_alpha = 1.96  # for alpha=0.05
    z_beta = 0.84   # for power=0.80
    p1 = baseline_rate
    p2 = baseline_rate + mde
    p_bar = (p1 + p2) / 2

    n = ((z_alpha * math.sqrt(2 * p_bar * (1 - p_bar)) +
          z_beta * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 /
         (p2 - p1) ** 2)

    return int(math.ceil(n))


@dataclass
class ABTestResult:
    variant_a_rate: float
    variant_b_rate: float
    relative_lift: float
    is_significant: bool
    p_value: float
    recommendation: str


def analyze_ab_test(
    variant_a_successes: int, variant_a_total: int,
    variant_b_successes: int, variant_b_total: int,
    metric_name: str = "satisfaction"
) -> ABTestResult:
    """Analyze A/B test results and provide recommendation."""
    rate_a = variant_a_successes / max(variant_a_total, 1)
    rate_b = variant_b_successes / max(variant_b_total, 1)
    lift = (rate_b - rate_a) / max(rate_a, 0.001) * 100

    test = z_test_proportions(rate_a, variant_a_total, rate_b, variant_b_total)

    if test["significant"]:
        if lift > 0:
            recommendation = f"Variant B wins: {metric_name} improved by {lift:.1f}% (p={test['p_value']:.4f}). Roll out B."
        else:
            recommendation = f"Variant A wins: {metric_name} is {abs(lift):.1f}% better (p={test['p_value']:.4f}). Keep A."
    else:
        recommendation = f"No significant difference (p={test['p_value']:.4f}). Continue test or increase traffic."

    return ABTestResult(
        variant_a_rate=round(rate_a, 4),
        variant_b_rate=round(rate_b, 4),
        relative_lift=round(lift, 2),
        is_significant=test["significant"],
        p_value=test["p_value"],
        recommendation=recommendation,
    )


def main():
    print("=== A/B Test Analyzer ===\n")

    # Scenario 1: Significant result
    result = analyze_ab_test(
        variant_a_successes=350, variant_a_total=500,
        variant_b_successes=420, variant_b_total=500,
        metric_name="user satisfaction"
    )
    print("Test 1 (500 samples per variant):")
    print(f"  Variant A: {result.variant_a_rate:.1%} satisfaction")
    print(f"  Variant B: {result.variant_b_rate:.1%} satisfaction")
    print(f"  Lift: {result.relative_lift:+.1f}%")
    print(f"  Significant: {result.is_significant} (p={result.p_value})")
    print(f"  → {result.recommendation}")

    # Scenario 2: Not enough data
    result2 = analyze_ab_test(
        variant_a_successes=8, variant_a_total=10,
        variant_b_successes=9, variant_b_total=10,
        metric_name="task completion"
    )
    print(f"\nTest 2 (10 samples per variant):")
    print(f"  → {result2.recommendation}")

    # Sample size calculation
    print(f"\n=== Sample Size Planning ===")
    for baseline in [0.70, 0.80, 0.90]:
        for mde in [0.05, 0.10]:
            n = required_sample_size(baseline, mde)
            print(f"  Baseline={baseline:.0%}, MDE={mde:.0%} → Need {n:,} samples per variant")


if __name__ == "__main__":
    main()
