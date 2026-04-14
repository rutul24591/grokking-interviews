# A/B Test Analyzer for Model Comparison

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`math`, `dataclasses`, `typing`).

## What This Demonstrates

This example performs statistical significance testing for A/B test results comparing two model variants. It implements a two-proportion z-test to determine whether observed differences are statistically significant, calculates required sample sizes for desired statistical power, and provides actionable recommendations based on the results.

## Code Walkthrough

### Key Functions

- **`z_test_proportions(p1, n1, p2, n2)`**: Performs a two-proportion z-test. Computes the pooled proportion, standard error, z-score, and approximate p-value (using a normal CDF approximation via `math.erf`).
- **`_normal_cdf(x)`**: Approximation of the standard normal cumulative distribution function using the error function.
- **`required_sample_size(baseline_rate, mde, alpha, power)`**: Calculates the minimum sample size per variant needed to detect a minimum detectable effect (MDE) with the given significance level (alpha) and statistical power.

### Key Classes

- **`ABTestResult`** (dataclass): Holds the conversion rates for both variants, relative lift percentage, significance flag, p-value, and a human-readable recommendation.

### Execution Flow

1. **`analyze_ab_test()`** is the main entry point. It takes success counts and total counts for both variants, plus a metric name.
2. It computes conversion rates (`rate_a`, `rate_b`) and the relative lift percentage.
3. Calls `z_test_proportions()` to get the z-score, p-value, and significance flag.
4. Based on significance and lift direction, generates a recommendation: "Variant B wins", "Variant A wins", or "Continue test".
5. **`main()`** runs three scenarios:
   - **Test 1**: 500 samples per variant with a meaningful difference -- produces a significant result with a clear winner.
   - **Test 2**: Only 10 samples per variant -- insufficient data, recommends continuing the test.
   - **Sample size planning**: Shows required sample sizes for different baseline rates (70%, 80%, 90%) and MDE values (5%, 10%).

### Important Variables

- `z_alpha = 1.96`: Critical value for alpha=0.05 (two-tailed).
- `z_beta = 0.84`: Critical value for power=0.80 (beta=0.20).
- `p_value < 0.05`: Standard threshold for statistical significance.

## Key Takeaways

- Statistical significance testing prevents false conclusions from random noise in A/B test results.
- Sample size planning is critical: detecting small effects (5% MDE) requires substantially more data than large effects (10% MDE).
- The two-proportion z-test is appropriate when comparing binary outcomes (e.g., satisfied/unsatisfied) between two variants.
- Non-significant results with small sample sizes mean "need more data," not "no difference exists."
- Production A/B testing systems should also consider sequential testing methods to allow early stopping without inflating false positive rates.
