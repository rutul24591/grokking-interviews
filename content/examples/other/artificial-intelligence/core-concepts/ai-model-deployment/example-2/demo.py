"""
Example 2: GPU Memory Calculator for Model Serving

Demonstrates:
- Calculating GPU memory for model weights + KV cache
- Determining max concurrent requests per GPU
- Quantization impact on memory and capacity
"""

def calculate_gpu_memory(
    model_params_b: float,  # Model size in billions
    context_length: int,
    num_layers: int,
    num_heads: int,
    head_dim: int,
    dtype_bytes: int = 2,  # FP16 = 2, INT8 = 1, INT4 = 0.5
    max_concurrent_requests: int = 10,
) -> dict:
    """Calculate GPU memory breakdown for LLM serving."""
    # Model weights
    weight_memory_gb = model_params_b * 1e9 * dtype_bytes / (1024**3)

    # KV cache per request
    kv_per_request = 2 * num_layers * num_heads * head_dim * context_length * dtype_bytes
    kv_per_request_mb = kv_per_request / (1024**2)

    # Total KV cache
    total_kv_mb = kv_per_request_mb * max_concurrent_requests
    total_kv_gb = total_kv_mb / 1024

    # Activation memory (typically 5-10% of weight memory)
    activation_gb = weight_memory_gb * 0.08

    # Total
    total_gb = weight_memory_gb + total_kv_gb + activation_gb

    return {
        "model_params_b": model_params_b,
        "dtype": f"{'FP16' if dtype_bytes == 2 else 'INT8' if dtype_bytes == 1 else 'INT4'}",
        "weight_memory_gb": round(weight_memory_gb, 1),
        "kv_cache_per_request_mb": round(kv_per_request_mb, 1),
        "total_kv_cache_gb": round(total_kv_gb, 1),
        "activation_memory_gb": round(activation_gb, 1),
        "total_memory_gb": round(total_gb, 1),
        "max_requests_on_80gb": int((80 - weight_memory_gb - activation_gb) / kv_per_request_mb),
        "max_requests_on_40gb": int((40 - weight_memory_gb - activation_gb) / kv_per_request_mb),
    }


def main():
    print("=== GPU Memory Calculator for LLM Serving ===\n")

    configs = [
        {"name": "Llama 3 8B", "params": 8, "layers": 32, "heads": 32, "head_dim": 128},
        {"name": "Llama 3 70B", "params": 70, "layers": 80, "heads": 64, "head_dim": 128},
    ]

    context_lengths = [4096, 32768, 131072]

    for config in configs:
        print(f"\n{'='*60}")
        print(f"Model: {config['name']} ({config['params']}B parameters)")
        print(f"{'='*60}")

        for ctx in context_lengths:
            print(f"\n  Context: {ctx:,} tokens")
            for dtype_bytes, dtype_name in [(2, "FP16"), (1, "INT8"), (0.5, "INT4")]:
                result = calculate_gpu_memory(
                    model_params_b=config["params"],
                    context_length=ctx,
                    num_layers=config["layers"],
                    num_heads=config["heads"],
                    head_dim=config["head_dim"],
                    dtype_bytes=dtype_bytes,
                    max_concurrent_requests=10,
                )
                print(f"    {dtype_name}: Weights={result['weight_memory_gb']}GB, "
                      f"KV(10 req)={result['total_kv_cache_gb']}GB, "
                      f"Total={result['total_memory_gb']}GB | "
                      f"Max req on A100-80GB: {result['max_requests_on_80gb']}")


if __name__ == "__main__":
    main()
