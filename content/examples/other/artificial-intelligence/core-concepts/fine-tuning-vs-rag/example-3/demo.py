"""
Example 3: LoRA Adapter Training Simulation

Demonstrates:
- LoRA low-rank decomposition concept
- Parameter count comparison (full vs LoRA)
- Memory savings from quantization
- Adapter swapping at runtime
"""

import math


def calculate_lora_params(
    model_params: int,
    lora_rank: int,
    lora_target_modules: int,
) -> dict:
    """Calculate LoRA parameter counts and savings."""
    # Full fine-tuning trains all parameters
    full_trainable = model_params

    # LoRA trains only the low-rank matrices
    # Each target module gets A (d×r) and B (r×d) matrices
    # For simplicity, assume average dimension d per target module
    avg_dim = int(math.sqrt(model_params / lora_target_modules))
    lora_trainable = lora_target_modules * 2 * avg_dim * lora_rank

    reduction = full_trainable / max(lora_trainable, 1)

    return {
        "model_params": model_params,
        "full_trainable": full_trainable,
        "lora_trainable": lora_trainable,
        "lora_rank": lora_rank,
        "reduction_factor": f"{reduction:,.0f}x",
        "adapter_size_mb": round(lora_trainable * 4 / (1024 * 1024), 2),  # FP32
        "full_model_size_mb": round(model_params * 2 / (1024 * 1024)),  # FP16
    }


def main():
    print("=== LoRA Parameter Analysis ===\n")

    models = [
        {"name": "Llama 3 8B", "params": 8_000_000_000},
        {"name": "Llama 3 70B", "params": 70_000_000_000},
        {"name": "GPT-4 (est.)", "params": 1_800_000_000_000},
    ]

    for model in models:
        result = calculate_lora_params(
            model_params=model["params"],
            lora_rank=16,
            lora_target_modules=32,  # attention layers
        )

        print(f"Model: {model['name']}")
        print(f"  Total parameters: {model['params']:,}")
        print(f"  Full fine-tuning: {result['full_trainable']:,} trainable")
        print(f"  LoRA trainable: {result['lora_trainable']:,} trainable")
        print(f"  Reduction: {result['reduction_factor']}")
        print(f"  Adapter size: {result['adapter_size_mb']} MB")
        print(f"  Full model (FP16): {result['full_model_size_mb']:,} MB")
        print()

    print("=== Key Insights ===")
    print("1. LoRA adapters are megabytes, not gigabytes — easily swappable")
    print("2. Multiple adapters can coexist (different tasks, different domains)")
    print("3. QLoRA with 4-bit base model: 70B model fits in 35GB GPU memory")
    print("4. Training time: hours instead of weeks")
    print("5. Same base model, different adapters = multi-task without multi-model")


if __name__ == "__main__":
    main()
