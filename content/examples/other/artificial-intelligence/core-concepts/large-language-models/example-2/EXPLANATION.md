# Example 2: Temperature and Sampling Strategy Comparison

## How to Run

```bash
python demo.py
```

**Dependencies:** No external packages required. This example uses only Python's built-in `math` module and standard library type hints (`List`, `Tuple`, `Dict` from `typing`). Run with Python 3.7+.

---

## What This Demonstrates

This example illustrates how different sampling strategies — temperature scaling, top-k filtering, top-p (nucleus) filtering, and their combinations — affect the token probability distribution during text generation in large language models. By applying these techniques to a fixed set of simulated logits, the demo makes visible how each strategy trades off between deterministic output (greedy decoding) and creative diversity (stochastic sampling), which is a core knob that engineers tune when deploying LLMs for different use cases.

---

## Code Walkthrough

### Key Classes and Their Responsibilities

This example does not define classes; instead, it uses three pure functions that each encapsulate a distinct sampling mechanism:

- **`softmax`** — Converts raw model logits into a normalized probability distribution, with an adjustable temperature parameter that sharpens or flattens the distribution.
- **`top_k_filtering`** — Restricts the token pool to the k most probable candidates, then renormalizes their probabilities so they sum to 1.0.
- **`top_p_filtering`** — Implements nucleus sampling: keeps the smallest subset of tokens whose cumulative probability exceeds threshold `p`, then renormalizes.

### Important Functions and Their Role

#### `softmax(logits, temperature)`

This is the mathematical bridge between raw logits (unnormalized log-probabilities produced by the model's final linear layer) and usable probabilities. The function first divides every logit by the temperature value. A **low temperature** (e.g., 0.1) amplifies differences between logits, pushing the highest logit toward probability 1.0 and suppressing others — approximating greedy decoding. A **high temperature** (e.g., 2.0) compresses differences, making the distribution more uniform and increasing the chance that lower-probability tokens get sampled. The numerically stable variant used here subtracts `max(scaled)` before exponentiation to prevent overflow, which is the standard production implementation.

#### `top_k_filtering(probs, tokens, k)`

After softmax produces probabilities, this function sorts tokens by probability in descending order, selects the top `k`, and renormalizes. For instance, with `k=3`, only the three most likely tokens remain eligible for sampling. This prevents the model from ever picking tail-probability tokens (e.g., nonsensical completions), but the fixed `k` can be too restrictive when the distribution is flat or too permissive when it is sharp.

#### `top_p_filtering(probs, tokens, p)`

Nucleus sampling addresses top-k's rigidity by being **adaptive**: it accumulates probability mass from the most likely tokens downward until the cumulative sum reaches `p` (e.g., 0.9). If the distribution is peaked, only a few tokens are kept; if it is flat, more tokens survive. After selection, probabilities are renormalized. This is the sampling strategy used by default in many production LLM APIs.

#### `demonstrate_sampling()`

This is the orchestrator function. It defines a fixed vocabulary of 10 tokens with corresponding logits, then runs five demonstrations:
1. Baseline probabilities at temperature 1.0.
2. Temperature sweep across six values (0.1 through 2.0), showing how the top-3 tokens' probabilities shift.
3. Top-k filtering with k=3.
4. Top-p filtering with p=0.9.
5. A combined strategy using temperature 0.7 followed by top-p 0.9.

### Critical Variables and Data Structures

| Variable | Type | Description |
|---|---|---|
| `tokens` | `List[str]` | A vocabulary of 10 candidate tokens for next-token prediction. |
| `logits` | `List[float]` | Raw, unnormalized scores from the model's final layer. Higher values indicate the model assigns more confidence to that token. |
| `probs` | `List[float]` | Normalized probabilities output by softmax; sum to 1.0. |
| `indexed` | `List[Tuple[int, float]]` | Intermediate structure pairing each token's index with its probability, used for sorting and selecting top candidates. |
| `filtered_probs` / `filtered_tokens` | `List[float]` / `List[str]` | The pruned and renormalized probability distribution after top-k or top-p filtering. |

### Execution Flow

1. **Entry point:** `if __name__ == "__main__"` calls `demonstrate_sampling()`.
2. **Baseline computation:** The function calls `softmax(logits, temperature=1.0)` to get the reference probability distribution and prints all 10 token-probability pairs.
3. **Temperature sweep:** A loop iterates over temperatures `[0.1, 0.3, 0.7, 1.0, 1.5, 2.0]`. For each, `softmax` is called with that temperature, the results are sorted, and the top-3 tokens with their probabilities are printed. This demonstrates the smooth transition from near-deterministic (T=0.1) to highly stochastic (T=2.0) behavior.
4. **Top-k demo:** The function calls `top_k_filtering` with the baseline probabilities and `k=3`. Only the three highest-probability tokens remain, and their renormalized probabilities are displayed.
5. **Top-p demo:** The function calls `top_p_filtering` with `p=0.9`. The smallest set of tokens whose cumulative probability reaches 90% is selected and printed.
6. **Combined demo:** The function first applies `softmax` with `temperature=0.7`, then pipes those probabilities into `top_p_filtering` with `p=0.9`, illustrating how production systems commonly chain these techniques.
7. **Output:** All results are printed to stdout in a human-readable tabular format.

---

## Key Takeaways

- **Temperature is a smoothness knob:** Low temperature (< 0.5) makes output more deterministic and focused, ideal for code generation or factual QA. High temperature (> 1.0) increases diversity and creativity, useful for brainstorming or creative writing.
- **Top-k and top-p serve different purposes:** Top-k enforces a hard cap on candidate count, which is simple but inflexible. Top-p adapts to the shape of the probability distribution, making it more robust across varied inputs.
- **Production systems combine strategies:** Real LLM APIs typically apply temperature scaling first, then top-p filtering, and sometimes top-k as an additional safety net. This example's combined demo (T=0.7 + p=0.9) mirrors that pipeline.
- **Renormalization is critical:** After filtering, probabilities must be renormalized to sum to 1.0; otherwise, sampling from the filtered set would produce incorrect distributions. Both filtering functions handle this step.
- **Numerical stability matters:** The softmax implementation subtracts the maximum scaled logit before exponentiation, which prevents floating-point overflow when logits are large — a pattern you should always use in production code.
