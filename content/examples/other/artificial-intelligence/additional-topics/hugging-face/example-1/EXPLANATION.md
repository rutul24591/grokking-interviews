# Hugging Face Transformers -- Model Loading and Inference

## How to Run

```bash
python demo.py
```

For full functionality (not required for simulated output):
```bash
pip install transformers huggingface_hub torch
```

## What This Demonstrates

This example shows two approaches to loading and running inference with Hugging Face Transformer models: the quick `pipeline` API for prototyping and the `AutoModel`/`AutoTokenizer` API for production use. It also demonstrates how to fetch model metadata from the Hugging Face Hub.

## Code Walkthrough

### Key Functions

1. **`demo_pipeline_api()`**: Uses the `pipeline` API for one-line text generation. Loads the GPT-2 model with a pinned revision hash for reproducibility. Sets `max_new_tokens=50` to limit output length. The pipeline API handles tokenization, generation, and decoding automatically.

2. **`demo_auto_api()`**: Uses `AutoTokenizer` and `AutoModelForCausalLM` for full control over the generation pipeline. Demonstrates production-grade settings:
   - `temperature=0.7`: Controls output randomness (lower = more deterministic).
   - `top_p=0.9`: Nucleus sampling threshold for diverse but coherent outputs.
   - `do_sample=True`: Enables stochastic sampling (vs greedy decoding).
   - `pad_token_id`: Required for GPT-2 which lacks a padding token by default.

3. **`demo_model_info()`**: Fetches model metadata from the Hugging Face Hub including download count, tags, and pipeline type.

### Execution Flow

1. The script first checks if `transformers` is installed. If not, it prints simulated output describing what each approach does.
2. With transformers installed:
   - Pipeline API: Loads GPT-2, generates text from "The future of AI is" with default settings.
   - AutoModel API: Loads tokenizer and model separately, tokenizes input, generates with controlled settings, decodes output.
   - Model Info: Fetches and displays GPT-2 metadata from the Hub.

### Important Variables

- `revision="607a30d7..."`: Pins the model to a specific commit hash, ensuring reproducible results across runs.
- `temperature=0.7`: Balances creativity and coherence in text generation.
- `top_p=0.9`: Nucleus sampling -- only considers tokens whose cumulative probability is in the top 90%.

## Key Takeaways

- The `pipeline` API is ideal for rapid prototyping -- a single line handles the entire tokenize-generate-decode cycle.
- The `AutoModel` API provides fine-grained control over every step, which is essential for production systems that need custom tokenization, generation parameters, or post-processing.
- Pinning model versions with the `revision` parameter ensures that model behavior doesn't change when the Hub model is updated.
- Generation parameters (temperature, top_p, max_new_tokens) significantly impact output quality and must be tuned per use case.
- The Hugging Face Hub provides rich metadata (downloads, tags, licenses) that is essential for model selection and compliance checking.
