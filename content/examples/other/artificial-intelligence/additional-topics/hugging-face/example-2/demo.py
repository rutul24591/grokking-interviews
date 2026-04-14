"""
Example 2: Hugging Face Datasets — Loading, Streaming, and Processing

Demonstrates:
- Loading datasets from the Hub
- Streaming mode for large datasets
- Filtering, mapping, and batching
- Train/test splitting
"""

try:
    from datasets import load_dataset
    HAS_DATASETS = True
except ImportError:
    HAS_DATASETS = False
    print("Install datasets: pip install datasets")


def demo_load_dataset():
    """Load a dataset from the Hub."""
    print("=== Loading Dataset ===")
    
    # Load a small dataset for demonstration
    dataset = load_dataset("imdb", split="train[:1000]")
    print(f"  Dataset: imdb")
    print(f"  Size: {len(dataset)} examples")
    print(f"  Columns: {dataset.column_names}")
    print(f"  First example text length: {len(dataset[0]['text'])} chars")


def demo_streaming():
    """Stream a large dataset without downloading."""
    print("\n=== Streaming Mode ===")
    
    # Stream mode processes example-by-example
    dataset = load_dataset("imdb", split="train", streaming=True)
    
    # Process first few examples without full download
    count = 0
    for example in dataset:
        count += 1
        if count > 3:
            break
        print(f"  Example {count}: {len(example['text'])} chars, label={example['label']}")
    
    print(f"  Streamed {count} examples without full download")


def demo_processing():
    """Filter, map, and split datasets."""
    print("\n=== Dataset Processing ===")
    
    dataset = load_dataset("imdb", split="train[:500]")
    
    # Filter: keep only positive reviews
    positive = dataset.filter(lambda x: x["label"] == 1)
    print(f"  Positive reviews: {len(positive)} / {len(dataset)}")
    
    # Map: add text length column
    dataset = dataset.map(lambda x: {"text_length": len(x["text"])})
    avg_length = sum(dataset["text_length"]) / len(dataset)
    print(f"  Average review length: {avg_length:.0f} chars")
    
    # Train/test split
    split = dataset.train_test_split(test_size=0.2)
    print(f"  Train: {len(split['train'])}, Test: {len(split['test'])}")


if __name__ == "__main__":
    if not HAS_DATASETS:
        print("=== Hugging Face Datasets Demo (Simulated) ===\n")
        print("load_dataset: Unified interface for 200K+ datasets")
        print("Streaming: Process terabyte datasets without downloading")
        print("Processing: Filter, map, batch, split operations")
    else:
        demo_load_dataset()
        demo_streaming()
        demo_processing()
