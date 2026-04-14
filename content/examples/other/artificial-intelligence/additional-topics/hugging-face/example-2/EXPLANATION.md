# Hugging Face Datasets -- Loading, Streaming, and Processing

## How to Run

```bash
python demo.py
```

For full functionality (not required for simulated output):
```bash
pip install datasets
```

## What This Demonstrates

This example demonstrates three core operations with the Hugging Face `datasets` library: loading datasets from the Hub with slicing, streaming large datasets without downloading them, and processing datasets through filtering, mapping, and train/test splitting.

## Code Walkthrough

### Key Functions

1. **`demo_load_dataset()`**: Loads the IMDB dataset with a slice (`train[:1000]`) to fetch only the first 1000 examples. Prints dataset size, column names, and an example text length. This demonstrates the unified loading interface that works across 200K+ datasets on the Hub.

2. **`demo_streaming()`**: Loads the same dataset in streaming mode (`streaming=True`). This processes examples one at a time without downloading the entire dataset to disk. The loop processes only 3 examples to demonstrate the streaming behavior. This is critical for terabyte-scale datasets that cannot fit on local storage.

3. **`demo_processing()`**: Demonstrates three dataset operations:
   - **Filter**: Keeps only positive reviews (label == 1), reducing the dataset by approximately half.
   - **Map**: Adds a computed `text_length` column to each example, then computes the average review length.
   - **Train/Test Split**: Splits the dataset into 80% training and 20% testing sets using `train_test_split(test_size=0.2)`.

### Execution Flow

1. The script checks if the `datasets` library is installed. If not, it prints a summary of the three capabilities.
2. With datasets installed:
   - Loads 1000 IMDB examples and prints basic statistics.
   - Streams 3 examples without downloading the full dataset.
   - Filters, maps, and splits a 500-example subset.

### Important Variables

- `split="train[:1000]"`: Slice notation for loading a subset of the dataset.
- `streaming=True`: Enables lazy loading -- examples are fetched on-demand rather than downloaded.
- `test_size=0.2`: 20% of data reserved for testing/evaluation.

## Key Takeaways

- The `datasets` library provides a unified interface for loading, streaming, and processing datasets from the Hugging Face Hub, regardless of the underlying format or storage.
- Streaming mode is essential for large datasets (hundreds of GBs) -- it processes examples lazily without requiring full download, reducing storage and load time.
- The filter/map/split operations mirror the data preprocessing pipeline needed for training: filtering removes unwanted examples, mapping computes derived features, and splitting creates train/eval/test sets.
- Slicing (`train[:1000]`) is evaluated server-side when possible, making it efficient for fetching subsets without loading the full dataset.
- Production ML pipelines typically stream training data, cache evaluation sets locally, and use reproducible splits for consistent benchmarking.
