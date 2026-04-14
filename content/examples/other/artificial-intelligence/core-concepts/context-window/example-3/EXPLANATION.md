# Example 3: RoPE (Rotary Position Embedding) Implementation

## How to Run

```bash
python demo.py
```

**Dependencies:** None. Pure Python with only built-in functions (`math`, `typing`). No external packages required.

## What This Demonstrates

This example implements **Rotary Position Embedding (RoPE)**, the positional encoding scheme used by most modern transformer models (Llama, Mistral, Qwen, and many others). Unlike learned absolute positional encodings used in the original Transformer paper, RoPE encodes position information by rotating query and key vectors through angles proportional to their token positions. This approach enables the model to naturally capture relative position information in attention scores and — critically — allows the model to generalize to sequence lengths far beyond what it was trained on (length extrapolation).

## Code Walkthrough

### Key Functions

- **`apply_rope()`**: The core RoPE implementation that rotates query and key vectors:
  - Takes query vector `q`, key vector `k`, their respective positions `pos_q` and `pos_k`, embedding dimension `dim`, and base frequency `theta` (default 10000.0).
  - Asserts that the dimension is even (RoPE operates on pairs of dimensions).
  - For each pair of dimensions `(i, i+1)`:
    1. Computes the frequency: `freq = 1.0 / (theta ** (i / dim))`. Lower dimension pairs get higher frequencies (rotate faster), higher dimension pairs get lower frequencies (rotate slower).
    2. Computes rotation angles: `angle_q = pos_q * freq` and `angle_k = pos_k * freq`.
    3. Applies 2D rotation to both the query and key vectors using the standard rotation matrix: `x' = x*cos(angle) - y*sin(angle)`, `y' = x*sin(angle) + y*cos(angle)`.
  - Returns the rotated query and key vectors.
- **`dot_product()`**: Simple dot product computation — used to measure attention scores between rotated query and key vectors.

### Execution Flow (Step-by-Step)

1. **Setup**: Dimension 8, theta 10000.0. Query and key vectors are initialized with sample values. Two key vectors are prepared: one for same-position comparison and one for different-position comparison.
2. **Without positional encoding**: The dot product is computed between the raw query and key vectors. This shows the baseline where position information is absent — the dot product depends only on content similarity, not on where tokens appear in the sequence.
3. **With RoPE — same position**: Query and key are both at position 5. After rotation, the dot product is higher because both vectors were rotated by the same angle, preserving their content-based similarity.
4. **With RoPE — different positions (distance 3)**: Query at position 8, key at position 5. After rotation by different angles, the dot product decreases because the rotation introduces a phase difference proportional to the positional gap (8 - 5 = 3).
5. **With RoPE — same relative distance at far positions**: Query at position 50, key at position 47. The dot product is similar to case 4 because RoPE encodes relative position (50 - 47 = 3 = 8 - 5), not absolute position. The model sees the same attention pattern for tokens 3 positions apart regardless of where they are in the sequence.
6. **Print key properties**: Summarizes the five critical properties of RoPE — same-position boosting, distance-based attenuation, relative position encoding, and extrapolation capability.

### Important Variables

- `theta = 10000.0`: The base frequency parameter. Higher theta means slower rotation (positions have less effect at a given distance). The standard value of 10000 was chosen in the original RoPE paper and is used by Llama, Mistral, and most RoPE-based models.
- `freq = 1.0 / (theta ** (i / dim))`: The per-dimension frequency. Lower dimensions (small i) rotate faster (high frequency), capturing fine-grained positional information. Higher dimensions rotate slower (low frequency), capturing coarse-grained positional information. This multi-frequency design is what enables RoPE to encode positions across a wide range.
- `dim` must be even: RoPE operates on pairs of dimensions as 2D rotation. If the embedding dimension is odd, padding is required (models typically use even dimensions).

## Key Takeaways

- **RoPE encodes relative position**: The dot product between rotated query and key depends on their relative distance (pos_q - pos_k), not their absolute positions. This is mathematically elegant because attention is fundamentally about how tokens relate to each other, not where they are in absolute terms.
- **Length extrapolation is RoPE's superpower**: Because rotation is well-defined for any position index (not just positions seen during training), RoPE-based models can process sequences longer than their training context. A model trained on 4K tokens can often handle 8K or 16K tokens at inference time, though quality degrades gradually.
- **Multi-frequency design**: Different dimension pairs rotate at different frequencies, creating a rich positional encoding that captures both nearby relationships (high-frequency dimensions) and distant relationships (low-frequency dimensions). This is more expressive than a single-frequency encoding.
- **RoPE is applied to Q and K, not V**: Only the query and key vectors are rotated because position affects how tokens attend to each other (Q-K dot product). The value vector carries content information and does not need positional encoding.
- **Theta controls extrapolation range**: The base frequency theta = 10000 determines how quickly rotation angles grow with position. Some models (like Llama 3) use theta scaling (increasing theta) to extend the effective context window without retraining, a technique known as "RoPE scaling" or "NTK-aware RoPE."
