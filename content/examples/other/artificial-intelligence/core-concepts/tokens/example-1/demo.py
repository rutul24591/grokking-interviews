"""
Example 1: BPE Tokenization Implementation from Scratch

Demonstrates:
- How Byte-Pair Encoding (BPE) tokenization works internally
- The merge operation that combines frequent byte pairs
- Building a vocabulary from training corpus
- Encoding text using learned merge rules
"""

from collections import Counter, defaultdict
from typing import Dict, List, Tuple


class BPETokenizer:
    """Simple Byte-Pair Encoding tokenizer implementation."""

    def __init__(self, vocab_size: int = 100):
        self.vocab_size = vocab_size
        self.vocab: Dict[str, int] = {}
        self.merges: List[Tuple[str, str]] = []

    def _get_stats(self, corpus_tokens: List[List[str]]) -> Counter:
        """Count frequency of adjacent symbol pairs."""
        pairs = Counter()
        for tokens in corpus_tokens:
            for i in range(len(tokens) - 1):
                pairs[(tokens[i], tokens[i + 1])] += 1
        return pairs

    def _merge_pair(self, pair: Tuple[str, str], tokens: List[str]) -> List[str]:
        """Merge all occurrences of the given pair in the token list."""
        new_tokens = []
        i = 0
        while i < len(tokens):
            if i < len(tokens) - 1 and tokens[i] == pair[0] and tokens[i + 1] == pair[1]:
                new_tokens.append(pair[0] + pair[1])
                i += 2
            else:
                new_tokens.append(tokens[i])
                i += 1
        return new_tokens

    def train(self, corpus: List[str]) -> None:
        """Train BPE tokenizer on a corpus of text."""
        # Initialize with character-level tokens, using underscore for space
        tokenized_corpus = []
        for text in corpus:
            words = text.lower().split()
            word_tokens = [list(word) + ['</w>'] for word in words]
            tokenized_corpus.extend(word_tokens)

        # Build initial vocabulary (characters)
        all_chars = set()
        for tokens in tokenized_corpus:
            all_chars.update(tokens)
        self.vocab = {char: idx for idx, char in enumerate(sorted(all_chars))}

        # Iteratively merge most frequent pairs
        for _ in range(self.vocab_size - len(self.vocab)):
            stats = self._get_stats(tokenized_corpus)
            if not stats:
                break

            best_pair = stats.most_common(1)[0][0]
            new_symbol = best_pair[0] + best_pair[1]

            # Add to vocabulary
            self.vocab[new_symbol] = len(self.vocab)
            self.merges.append(best_pair)

            # Apply merge to corpus
            tokenized_corpus = [
                self._merge_pair(best_pair, tokens)
                for tokens in tokenized_corpus
            ]

    def encode(self, text: str) -> List[int]:
        """Encode text to token IDs using trained BPE."""
        # Start with character-level tokens
        tokens = list(text.lower()) + ['</w>']

        # Apply learned merges in order
        for pair in self.merges:
            merged = pair[0] + pair[1]
            new_tokens = []
            i = 0
            while i < len(tokens):
                if (i < len(tokens) - 1 and
                    tokens[i] == pair[0] and
                    tokens[i + 1] == pair[1]):
                    new_tokens.append(merged)
                    i += 2
                else:
                    new_tokens.append(tokens[i])
                    i += 1
            tokens = new_tokens

        # Convert to IDs (unknown tokens get character-level fallback)
        token_ids = [self.vocab.get(t, ord(t)) for t in tokens]
        return token_ids

    def get_token_count(self, text: str) -> int:
        """Get the number of tokens for a given text."""
        return len(self.encode(text))


def main():
    # Training corpus
    corpus = [
        "the quick brown fox jumps over the lazy dog",
        "the fox is quick and clever",
        "a lazy dog sleeps all day",
        "quick thinking saves the day",
        "the brown dog chases the fox",
    ]

    # Train tokenizer
    tokenizer = BPETokenizer(vocab_size=50)
    tokenizer.train(corpus)

    print("=== BPE Tokenizer Training ===")
    print(f"Vocabulary size: {len(tokenizer.vocab)}")
    print(f"Number of merges: {len(tokenizer.merges)}")
    print(f"\nTop 10 merges:")
    for i, (a, b) in enumerate(tokenizer.merges[:10]):
        print(f"  {i+1}. '{a}' + '{b}' -> '{a}{b}'")

    print(f"\n=== Tokenization Examples ===")
    test_texts = ["the quick fox", "a lazy day", "the brown dog", "unbelievable"]
    for text in test_texts:
        tokens = tokenizer.encode(text)
        token_strings = [t for t in tokenizer.encode(text)]
        # Show which vocab entries were used
        vocab_lookup = {v: k for k, v in tokenizer.vocab.items()}
        token_strs = [vocab_lookup.get(tid, chr(tid)) for tid in tokens]
        print(f"  '{text}' -> {token_strs} ({len(tokens)} tokens)")


if __name__ == "__main__":
    main()
