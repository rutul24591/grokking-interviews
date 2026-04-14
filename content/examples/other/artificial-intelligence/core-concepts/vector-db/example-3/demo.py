"""
Example 3: KV Cache Memory Estimator

Demonstrates:
- How KV cache memory scales with model size and context length
- Memory breakdown across layers, heads, and sequence length
- Impact of quantization on KV cache size
- Production capacity planning
"""

def calculate_kv_cache_memory(
    num_layers: int,
    num_heads: int,
    head_dim: int,
    seq_len: int,
    batch_size: int = 1,
    dtype_bytes: int = 2,  # float16 = 2 bytes
) -> dict:
    """Calculate KV cache memory consumption."""
    # KV cache stores K and V for each token at each layer for each head
    # Size per token per layer per head = 2 * head_dim * dtype_bytes (K and V)
    per_token_per_layer = 2 * num_heads * head_dim * dtype_bytes
    total_per_token = per_token_per_layer * num_layers
    total_for_seq = total_per_token * seq_len * batch_size

    return {
        "num_layers": num_layers,
        "num_heads": num_heads,
        "head_dim": head_dim,
        "seq_len": seq_len,
        "batch_size": batch_size,
        "dtype_bytes": dtype_bytes,
        "kv_per_token_per_layer_mb": per_token_per_layer / (1024 * 1024),
        "kv_per_token_mb": total_per_token / (1024 * 1024),
        "total_kv_cache_mb": total_for_seq / (1024 * 1024),
        "total_kv_cache_gb": total_for_seq / (1024 * 1024 * 1024),
    }


def main():
    models = {
        "Llama 3 8B": {"layers": 32, "heads": 32, "head_dim": 128},
        "Llama 3 70B": {"layers": 80, "heads": 64, "head_dim": 128},
        "GPT-4 (est.)": {"layers": 128, "heads": 128, "head_dim": 128},
    }

    seq_lengths = [4096, 16384, 65536, 131072]

    print("=== KV Cache Memory Estimator ===\n")

    for model_name, config in models.items():
        print(f"\n{'='*60}")
        print(f"Model: {model_name}")
        print(f"  Layers: {config['layers']}, Heads: {config['heads']}, Head dim: {config['head_dim']}")
        print(f"{'='*60}")

        for seq_len in seq_lengths:
            result = calculate_kv_cache_memory(
                num_layers=config["layers"],
                num_heads=config["heads"],
                head_dim=config["head_dim"],
                seq_len=seq_len,
            )
            # Also calculate with int8 quantization (1 byte instead of 2)
            result_q8 = calculate_kv_cache_memory(
                num_layers=config["layers"],
                num_heads=config["heads"],
                head_dim=config["head_dim"],
                seq_len=seq_len,
                dtype_bytes=1,
            )
            savings = (1 - result_q8["total_kv_cache_mb"] / result["total_kv_cache_mb"]) * 100

            print(f"\n  Context: {seq_len:,} tokens")
            print(f"    FP16 KV cache: {result['total_kv_cache_mb']:.1f} MB")
            print(f"    INT8 KV cache: {result_q8['total_kv_cache_mb']:.1f} MB ({savings:.0f}% savings)")

    print(f"\n=== Key Takeaways ===")
    print(f"1. KV cache grows linearly with sequence length")
    print(f"2. KV cache grows with model size (more layers, more heads)")
    print(f"3. For 70B models at 128K context, KV cache can exceed model weight memory")
    print(f"4. INT8 quantization halves KV cache memory with minimal quality loss")


if __name__ == "__main__":
    main()
