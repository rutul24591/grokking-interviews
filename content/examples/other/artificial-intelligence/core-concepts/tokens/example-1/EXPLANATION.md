## How to Run

```bash
python demo.py
```

No external dependencies required — uses only Python standard library (`collections.Counter`, `collections.defaultdict`, `typing`).

## What This Demonstrates

This example implements a **Byte-Pair Encoding (BPE) tokenizer from scratch**, demonstrating the core algorithm used by GPT, GPT-2, GPT-3, RoBERTa, and many other LLMs. It shows how a tokenizer starts with character-level tokens, identifies the most frequent adjacent character pairs in a training corpus, and iteratively merges them into subword units — building a vocabulary that balances between character-level (no OOV problem) and word-level (efficiency).

## Code Walkthrough

### Key Class: `BPETokenizer`

**`__init__(vocab_size)`** — Initializes the tokenizer with a target vocabulary size. Stores:
- `vocab` (Dict[str, int]): Maps token strings to integer IDs. Starts as character-level, grows with each merge.
- `merges` (List[Tuple[str, str]]): Ordered list of merge rules learned during training. Applied in order during encoding.

**`_get_stats(corpus_tokens)`** — Counts the frequency of every adjacent symbol pair across the entire corpus. Returns a `Counter` where keys are `(symbol_a, symbol_b)` tuples and values are occurrence counts. This is the heart of BPE — the most frequent pair is the next merge candidate.

**`_merge_pair(pair, tokens)`** — Scans through a token list and merges all occurrences of the given pair. For example, if `pair = ("q", "u")` and `tokens = ["q", "u", "i", "c", "k"]`, it produces `["qu", "i", "c", "k"]`. Uses a linear scan with index `i` that skips 2 positions after a merge to avoid re-processing merged tokens.

**`train(corpus)`** — The training algorithm in three phases:
1. **Character initialization**: Splits each word into characters, appends `</w>` (end-of-word marker), and builds the initial character-level vocabulary
2. **Vocabulary bootstrapping**: Collects all unique characters from the tokenized corpus into `self.vocab` with sequential integer IDs
3. **Iterative merging**: For each step up to `vocab_size - initial_vocab_size`, finds the most frequent pair via `_get_stats()`, adds the merged symbol to the vocabulary, records the merge rule, and applies the merge across the entire corpus. This gradually builds subword units like "the", "qu", "ing", "tion" from frequent character combinations

**`encode(text)`** — Encodes text to token IDs using the trained merge rules:
1. Converts text to lowercase character list with `</w>` marker
2. Applies each learned merge rule sequentially — if the merge says combine "q" + "u" into "qu", it scans the token list and performs that merge
3. Converts final tokens to IDs via vocabulary lookup, with fallback to `ord(t)` for unknown characters (character-level safety net)

**`get_token_count(text)`** — Convenience method that returns the number of tokens for a given text string.

### Execution Flow

```
main() → BPETokenizer(vocab_size=50)
       → train(corpus) → character split → build initial vocab → 38 merge iterations
       → encode("the quick fox") → character tokens → apply merges → token IDs
       → print vocabulary, merge rules, and tokenization results
```

The training corpus of 5 sentences produces approximately 38 merges, creating subword units like "the", "qu", "ick", "dog", "fox" from frequently co-occurring character pairs.

## Key Takeaways

- **BPE starts at character level**: Every character (including spaces via `</w>`) is initially a token, so there is zero risk of unknown tokens during encoding
- **Merges are frequency-driven**: The most common adjacent pairs get merged first, so common words like "the" become single tokens while rare words stay split into subword units
- **Merge order matters**: Merges are applied sequentially during encoding — earlier merges take priority over later ones, creating a deterministic tokenization
- **Vocabulary size is a trade-off**: Larger vocabularies produce shorter sequences (fewer tokens per text) but increase model embedding size and softmax computation cost
- **Character fallback prevents OOV**: Unknown tokens during encoding fall back to `ord(char)`, ensuring the tokenizer never fails on unseen input
- **`</w>` marks word boundaries**: This end-of-word marker lets the tokenizer distinguish between "ing" inside "sing" vs "ing" as a suffix on verbs