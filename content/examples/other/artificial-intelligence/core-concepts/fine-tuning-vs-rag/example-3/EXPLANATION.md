# Example 3: LoRA Adapter Training Simulation

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`math`).

## What This Demonstrates

This example illustrates the parameter efficiency of LoRA (Low-Rank Adaptation), a fine-tuning technique that trains only small low-rank decomposition matrices instead of the entire model. It calculates the trainable parameter count, memory savings, and adapter size for three models of different scales (Llama 3 8B, Llama 3 70B, and GPT-4 estimated). The analysis demonstrates why LoRA adapters are measured in megabytes rather than gigabytes, enabling efficient multi-task deployment where a single base model serves multiple tasks by swapping lightweight adapters at runtime.

## Code Walkthrough

### Key Function

**`calculate_lora_params(model_params, lora_rank, lora_target_modules)`** — Computes LoRA efficiency metrics:

**Full fine-tuning baseline:**
- `full_trainable = model_params` — Full fine-tuning makes all model parameters trainable, requiring gradient storage for the entire model during training.

**LoRA trainable parameters:**
- LoRA injects trainable low-rank matrices into specific layers (typically attention layers) while keeping the base model frozen.
- For each target module, LoRA adds two matrices: A (d x r) and B (r x d), where d is the layer dimension and r is the LoRA rank.
- The function estimates the average layer dimension as `sqrt(model_params / lora_target_modules)` and calculates `lora_trainable = target_modules * 2 * avg_dim * rank`.

**Efficiency metrics returned:**
- `reduction_factor` — How many times fewer parameters LoRA trains compared to full fine-tuning (e.g., "10,000x").
- `adapter_size_mb` — Size of the LoRA adapter in megabytes assuming FP32 (4 bytes per parameter).
- `full_model_size_mb` — Size of the full model in megabytes assuming FP16 (2 bytes per parameter).

### Execution Flow (from `main()`)

1. Three models are analyzed: Llama 3 8B, Llama 3 70B, and GPT-4 (estimated at 1.8 trillion parameters).
2. For each model, `calculate_lora_params()` is called with rank=16 and 32 target modules (representing attention layers).
3. Results are printed showing total parameters, full fine-tuning trainable count, LoRA trainable count, reduction factor, adapter size in MB, and full model size in MB.
4. Five key insights are printed summarizing the practical implications of LoRA's parameter efficiency.

## Key Takeaways

- **LoRA adapters are orders of magnitude smaller than full models** — While a 70B model requires ~140 GB in FP16, a LoRA adapter for the same model fits in a few megabytes, making it trivially easy to store, version, and deploy multiple adapters.
- **Multiple adapters coexist with a single base model** — Since the base model is frozen, different LoRA adapters (trained for different tasks, domains, or languages) can be swapped in at runtime without loading multiple full models, dramatically reducing memory requirements.
- **QLoRA enables fine-tuning on consumer GPUs** — Combining LoRA with 4-bit quantization of the base model means a 70B model (which normally requires multiple A100 GPUs) can be fine-tuned on a single GPU with 35-48 GB of memory.
- **Training time drops from weeks to hours** — Training only a tiny fraction of parameters means LoRA fine-tuning converges much faster and requires far less compute, making it accessible to teams without massive GPU clusters.
- **Rank selection is a trade-off** — Lower rank (e.g., 4-8) produces smaller adapters with potentially less adaptation capacity; higher rank (e.g., 16-64) provides more capacity but increases adapter size. The optimal rank depends on task complexity and available compute.
