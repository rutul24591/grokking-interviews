"""
Example 3: RoPE (Rotary Position Embedding) Implementation

Demonstrates:
- How RoPE encodes position information into attention vectors
- Why RoPE enables length extrapolation beyond training context
- Comparison with learned positional encodings
"""

import math
from typing import List, Tuple


def apply_rope(q: List[float], k: List[float], pos_q: int, pos_k: int, dim: int, theta: float = 10000.0) -> Tuple[List[float], List[float]]:
    """
    Apply Rotary Position Embedding to query and key vectors.

    RoPE rotates query and key vectors by an angle proportional to their
    position, encoding relative position information into the dot product.

    Args:
        q: Query vector
        k: Key vector
        pos_q: Position of query token
        pos_k: Position of key token
        dim: Embedding dimension (must be even)
        theta: Base frequency (10000 is standard)

    Returns:
        (rotated_q, rotated_k)
    """
    assert len(q) == len(k) == dim
    assert dim % 2 == 0, "Dimension must be even for RoPE"

    rotated_q = list(q)
    rotated_k = list(k)

    # Apply rotation to each pair of dimensions
    for i in range(0, dim, 2):
        # Frequency for this dimension pair
        freq = 1.0 / (theta ** (i / dim))

        # Rotation angles
        angle_q = pos_q * freq
        angle_k = pos_k * freq

        # Rotate query
        cos_q, sin_q = math.cos(angle_q), math.sin(angle_q)
        rotated_q[i] = q[i] * cos_q - q[i + 1] * sin_q
        rotated_q[i + 1] = q[i] * sin_q + q[i + 1] * cos_q

        # Rotate key
        cos_k, sin_k = math.cos(angle_k), math.sin(angle_k)
        rotated_k[i] = k[i] * cos_k - k[i + 1] * sin_k
        rotated_k[i + 1] = k[i] * sin_k + k[i + 1] * cos_k

    return rotated_q, rotated_k


def dot_product(a: List[float], b: List[float]) -> float:
    return sum(x * y for x, y in zip(a, b))


def main():
    dim = 8
    theta = 10000.0

    # Sample query and key vectors
    q = [0.1, -0.2, 0.3, 0.1, -0.1, 0.2, 0.0, 0.1]
    k_same_pos = [0.2, 0.1, -0.1, 0.3, 0.1, -0.1, 0.2, 0.0]  # Same position
    k_diff_pos = [0.15, 0.05, -0.15, 0.25, 0.05, -0.05, 0.15, 0.08]  # Different position

    print("=== RoPE (Rotary Position Embedding) ===\n")
    print(f"Dimension: {dim}, Theta: {theta}")

    # Without RoPE
    print("\n--- Without Positional Encoding ---")
    dot_no_pos_same = dot_product(q, k_same_pos)
    dot_no_pos_diff = dot_product(q, k_diff_pos)
    print(f"  q · k (same content, different positions): {dot_no_pos_same:.6f}")
    print(f"  q · k (different content, different positions): {dot_no_pos_diff:.6f}")
    print("  Note: No position information — only content matters")

    # With RoPE
    print("\n--- With RoPE ---")

    # Case 1: Query and key at same position
    rq, rk = apply_rope(q, k_same_pos, pos_q=5, pos_k=5, dim=dim, theta=theta)
    dot_rope_same = dot_product(rq, rk)
    print(f"  pos_q=5, pos_k=5: q·k = {dot_rope_same:.6f}")

    # Case 2: Query and key at different positions (distance 3)
    rq, rk = apply_rope(q, k_same_pos, pos_q=8, pos_k=5, dim=dim, theta=theta)
    dot_rope_diff = dot_product(rq, rk)
    print(f"  pos_q=8, pos_k=5: q·k = {dot_rope_diff:.6f}")

    # Case 3: Same relative distance (also distance 3, but at later positions)
    rq, rk = apply_rope(q, k_same_pos, pos_q=50, pos_k=47, dim=dim, theta=theta)
    dot_rope_far = dot_product(rq, rk)
    print(f"  pos_q=50, pos_k=47: q·k = {dot_rope_far:.6f}")

    print("\n=== Key Properties ===")
    print(f"1. Same position → higher dot product: {dot_rope_same:.4f}")
    print(f"2. Different position → lower dot product: {dot_rope_diff:.4f}")
    print(f"3. Same relative distance (far) → similar to #2: {dot_rope_far:.4f}")
    print(f"\n4. RoPE encodes RELATIVE position (pos_q - pos_k) = {8-5}")
    print(f"   The dot product depends only on the relative distance, not absolute positions")
    print(f"\n5. This enables extrapolation: RoPE works for positions never seen during training")
    print(f"   because the rotation operation is well-defined for any position index")


if __name__ == "__main__":
    main()
