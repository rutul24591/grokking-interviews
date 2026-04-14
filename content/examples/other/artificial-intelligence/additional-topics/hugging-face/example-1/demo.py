"""
Example 1: Hugging Face Transformers — Model Loading and Inference

Demonstrates:
- Loading models from the Hub using from_pretrained
- Using the pipeline API for quick inference
- Using AutoModel/AutoTokenizer for production control
- Version pinning with revision parameter
"""

try:
    from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False
    print("Install transformers: pip install transformers")


def demo_pipeline_api():
    """Quick inference using the pipeline API."""
    print("=== Pipeline API (Prototyping) ===")
    
    # One-liner for text generation
    generator = pipeline(
        "text-generation",
        model="gpt2",  # In production, use a specific revision
        revision="607a30d783ad8f0e7e6d5b0b0b0b0b0b0b0b0b0b",  # Pin version
        max_new_tokens=50,
    )
    
    result = generator("The future of AI is", num_return_sequences=1)
    print(f"  Input: 'The future of AI is'")
    print(f"  Output: {result[0]['generated_text'][:100]}...")


def demo_auto_api():
    """Production-grade model loading with full control."""
    print("\n=== AutoModel API (Production) ===")
    
    # Load tokenizer and model separately for full control
    tokenizer = AutoTokenizer.from_pretrained("gpt2")
    model = AutoModelForCausalLM.from_pretrained("gpt2")
    
    # Tokenize input
    inputs = tokenizer("The future of AI is", return_tensors="pt")
    
    # Generate with production settings
    outputs = model.generate(
        **inputs,
        max_new_tokens=50,
        temperature=0.7,
        top_p=0.9,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id,
    )
    
    # Decode output
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"  Input: 'The future of AI is'")
    print(f"  Output: {generated_text[:100]}...")
    print(f"  Settings: temp=0.7, top_p=0.9, max_new_tokens=50")


def demo_model_info():
    """Inspecting model metadata from the Hub."""
    print("\n=== Model Metadata ===")
    
    try:
        from huggingface_hub import model_info
        info = model_info("gpt2")
        print(f"  Model: {info.modelId}")
        print(f"  Downloads: {info.downloads:,}")
        print(f"  Tags: {info.tags}")
        print(f"  Pipeline Tag: {info.pipeline_tag}")
    except ImportError:
        print("  Install huggingface_hub for metadata access")


if __name__ == "__main__":
    if not HAS_TRANSFORMERS:
        # Simulated output for demonstration
        print("=== Hugging Face Transformers Demo (Simulated) ===\n")
        print("Pipeline API: One-line text generation")
        print("AutoModel API: Full control over tokenization, generation, decoding")
        print("Model Info: Metadata from the Hub (downloads, tags, license)")
    else:
        demo_pipeline_api()
        demo_auto_api()
        demo_model_info()
