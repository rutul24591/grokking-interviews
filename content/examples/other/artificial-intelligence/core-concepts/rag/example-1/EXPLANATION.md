# Example 1: RAG Pipeline — Document Chunking, Embedding, and Retrieval

## How to Run

```bash
python demo.py
```

**Dependencies:** Standard library only (`math`, `hashlib`, `typing`). No external packages required.

## What This Demonstrates

This example implements a complete **Retrieval-Augmented Generation (RAG) pipeline** from scratch, covering the three core stages: document chunking with overlap, embedding simulation with cosine similarity search, and prompt construction with retrieved context. It demonstrates how raw documents are broken into searchable chunks, indexed in a vector store, and retrieved based on query similarity — the foundational architecture behind RAG-based Q&A systems used in production applications.

## Code Walkthrough

### Key Functions and Classes

- **`chunk_document()`**: Splits text into word-based chunks of a target size with configurable overlap. The overlap parameter ensures that information spanning chunk boundaries is not lost — the last N words of one chunk repeat as the first N words of the next. The function splits on whitespace, iterates through the word list, and uses `start = end - overlap` to create overlapping windows.
- **`cosine_similarity()`**: Computes the cosine similarity between two vectors using the dot product divided by the product of their norms. Returns a value between 0.0 (orthogonal) and 1.0 (identical direction).
- **`simple_embed()`**: A hash-based embedding simulation that converts text to a fixed-dimensional vector. It uses SHA-256 to hash the text, then converts hex segments to floating-point values between 0.0 and 1.0. This is a deterministic but non-semantic embedding — in production, this would be replaced by a real embedding model (OpenAI, Cohere, etc.).
- **`VectorStore`**: A simple in-memory vector store that:
  - `add()` — embeds a document chunk and stores it with metadata.
  - `search()` — embeds a query, computes cosine similarity against all stored documents, sorts by similarity, and returns the top-k results.
- **`build_rag_pipeline()`**: A convenience function that takes a list of documents, chunks each one, and adds all chunks to a vector store with metadata (document ID, chunk ID, source).
- **`rag_query()`**: The query interface that searches the vector store for relevant chunks and constructs a prompt with the retrieved context, relevance scores, and the user's question.

### Execution Flow (Step-by-Step)

1. **Define documents**: Three sample documents are created covering Q3 financial data, authentication system details, and deployment pipeline configuration.
2. **Build index**: `build_rag_pipeline()` chunks each document (chunk_size=50 words, overlap=10 words) and adds all chunks to the vector store. Each chunk gets metadata including its source document ID and chunk ID.
3. **Query**: `rag_query()` is called with "What was the Q3 revenue growth?":
   - The query is embedded using `simple_embed()`.
   - All chunks are scored via cosine similarity.
   - Top-3 results are retrieved and sorted by relevance score.
   - A prompt is constructed with source attribution, relevance scores, and the retrieved text for each chunk.
4. **Print output**: Shows the number of indexed chunks, the query, the constructed prompt (truncated to 500 characters), and individual retrieval scores with text snippets.

### Important Variables

- `chunk_size` and `overlap`: Control how documents are split. Smaller chunks with more overlap improve retrieval precision but increase index size.
- `top_k`: The number of chunks retrieved per query — balances context richness against prompt token budget.
- `metadata` on each chunk: Includes `doc_id`, `chunk_id`, and `source` for provenance tracking — essential for citing sources in RAG responses.

## Key Takeaways

- **Chunking with overlap**: Overlapping chunks prevent information loss at boundaries. Without overlap, a sentence split across two chunks would have neither chunk contain the complete context needed for accurate retrieval.
- **Embedding determines retrieval quality**: The hash-based embedding used here is deterministic but not semantic — real embedding models (text-embedding-3-small, etc.) capture meaning so that "revenue growth" matches "15% increase year-over-year" even without exact keyword overlap.
- **Prompt construction with attribution**: The RAG prompt includes source metadata and relevance scores alongside retrieved text, enabling the LLM to weigh information by relevance and cite sources in its answer.
- **Vector store as search index**: The vector store is the core index that maps semantic queries to relevant document chunks. Its quality (embedding model, search algorithm, top-k selection) directly determines RAG answer quality.
- **Separation of concerns**: Chunking, embedding, storage, retrieval, and prompt construction are separate, composable functions — each can be independently upgraded (e.g., swapping the embedding model or adding hybrid search) without rewriting the entire pipeline.
