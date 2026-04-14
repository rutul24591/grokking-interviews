# GPU Memory Calculator for Model Serving

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library.

## What This Demonstrates

This example calculates GPU memory requirements for serving large language models, breaking down memory into three components: model weights, KV cache, and activations. It shows how context length, model size, and quantization level impact both per-GPU capacity and maximum concurrent request throughput.

## Code Walkthrough

### Key Functions

- **`calculate_gpu_memory()`**: The core calculator function. Takes model parameters (in billions), context length, architecture details (num_layers, num_heads, head_dim), data type bytes, and max concurrent requests. Returns a comprehensive memory breakdown.

### Memory Breakdown

1. **Model Weights**: `params_b * 1e9 * dtype_bytes` bytes. FP16 = 2 bytes/param, INT8 = 1 byte/param, INT4 = 0.5 bytes/param. Converted to GB for readability.
2. **KV Cache**: Per-request KV cache = `2 * num_layers * num_heads * head_dim * context_length * dtype_bytes`. The factor of 2 accounts for both key and value tensors. Scales linearly with context length and concurrent requests.
3. **Activations**: Estimated as 8% of weight memory. Used during forward pass computation.
4. **Total**: Sum of weights + KV cache + activations.

### Execution Flow

1. **`main()`** defines two model configurations: Llama 3 8B (32 layers, 32 heads) and Llama 3 70B (80 layers, 64 heads).
2. For each model, it evaluates three context lengths (4K, 32K, 131K tokens) across three quantization levels (FP16, INT8, INT4).
3. For each combination, it prints weight memory, KV cache for 10 requests, total memory, and maximum concurrent requests that fit on an A100-80GB GPU.

### Important Variables

- `dtype_bytes`: Controls quantization level. FP16=2, INT8=1, INT4=0.5.
- `context_length`: Dominates KV cache memory -- longer contexts dramatically increase per-request memory.
- `max_requests_on_80gb`: Calculated as `(80GB - weights - activations) / kv_per_request` -- the key throughput metric.

## Key Takeaways

- KV cache scales linearly with context length -- serving 131K token contexts requires dramatically more memory than 4K contexts.
- Quantization (INT8/INT4) reduces weight memory proportionally but does not reduce KV cache (which still uses FP16 in most implementations).
- For large models (70B), weights alone consume most GPU memory, leaving little room for KV cache -- requiring tensor parallelism across multiple GPUs.
- Maximum concurrent requests per GPU is primarily constrained by KV cache memory, not model weights.
- Production serving systems use techniques like PagedAttention (vLLM) or continuous batching to maximize KV cache utilization and increase throughput.
