# Example 3: KV Cache Memory Estimator

## How to Run

```bash
python demo.py
```

**Dependencies:** None. Pure Python with only built-in functions. No external packages required.

## What This Demonstrates

This example implements a **KV (Key-Value) cache memory estimator** that calculates how much GPU memory is consumed by the KV cache during autoregressive text generation for transformer models. The KV cache stores the key and value vectors for every token at every layer, enabling efficient generation by avoiding recomputation. Understanding KV cache memory is critical for production capacity planning because it can exceed model weight memory at long context lengths, limiting batch size and concurrent requests.

## Code Walkthrough

### Key Function

- **`calculate_kv_cache_memory()`**: Computes KV cache memory consumption given model architecture and generation parameters:
  - `num_layers` — number of transformer layers (each layer has its own K and V projections).
  - `num_heads` — number of attention heads per layer.
  - `head_dim` — dimensionality of each attention head.
  - `seq_len` — sequence length (number of tokens in the context).
  - `batch_size` — number of concurrent sequences being generated.
  - `dtype_bytes` — bytes per data type element (2 for float16/bfloat16, 1 for int8).
  
  **Formula**: For each token at each layer, the KV cache stores K and V vectors. Per token per layer: `2 * num_heads * head_dim * dtype_bytes` bytes. Total: `per_token_per_layer * num_layers * seq_len * batch_size`. The function returns a breakdown showing per-token-per-layer memory, per-token memory, and total memory in both MB and GB.

### Execution Flow (Step-by-Step)

1. **Define model configurations**: Three models are analyzed:
   - **Llama 3 8B**: 32 layers, 32 heads, 128 head dimension.
   - **Llama 3 70B**: 80 layers, 64 heads, 128 head dimension.
   - **GPT-4 (estimated)**: 128 layers, 128 heads, 128 head dimension.
2. **Define context lengths**: Four sequence lengths are tested: 4K, 16K, 64K, and 128K tokens.
3. **For each model and context length**:
   - Calculate KV cache memory with FP16 (2 bytes per element).
   - Calculate KV cache memory with INT8 quantization (1 byte per element).
   - Compute the memory savings percentage from quantization.
   - Print both FP16 and INT8 memory consumption.
4. **Print key takeaways**: Summarizes the four main insights about KV cache scaling behavior.

### Important Variables

- `per_token_per_layer = 2 * num_heads * head_dim * dtype_bytes`: Memory for one token at one layer. The factor of 2 accounts for both K (key) and V (value) vectors.
- `total_for_seq = per_token_per_layer * num_layers * seq_len * batch_size`: Total KV cache memory for the entire batch and sequence. This grows linearly with all four parameters.
- `dtype_bytes`: The precision parameter — FP16 (2 bytes), INT8 (1 byte), or FP32 (4 bytes). Quantization from FP16 to INT8 halves KV cache memory with minimal quality loss, which is a common production optimization.

## Key Takeaways

- **KV cache grows linearly with sequence length**: Doubling the context length doubles the KV cache memory. At 128K tokens, the KV cache for a 70B model can consume tens of gigabytes — potentially exceeding the model weights themselves.
- **KV cache grows with model size**: More layers and more heads each contribute linearly. A 70B model has roughly 5x the KV cache per token compared to an 8B model (80 layers x 64 heads vs. 32 layers x 32 heads).
- **KV cache can exceed model weights**: For large models at long context lengths, the KV cache memory can surpass the memory needed to store the model weights, making it the dominant memory consumer during generation — this is a critical bottleneck for long-context serving.
- **INT8 quantization halves KV cache memory**: Reducing precision from FP16 (2 bytes) to INT8 (1 byte) cuts KV cache memory by 50% with minimal impact on generation quality. This is one of the most cost-effective optimizations for production LLM serving, enabling 2x higher batch sizes or 2x longer contexts on the same GPU.
- **Batch size multiplies KV cache**: Each concurrent request adds its own KV cache. Production serving systems must balance batch size (throughput) against per-request context length to stay within GPU memory limits — this is the fundamental trade-off in LLM infrastructure design.
