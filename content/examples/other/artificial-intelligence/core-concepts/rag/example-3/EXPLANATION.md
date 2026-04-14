# Example 3: RAG Evaluation with RAGAS-inspired Metrics

## How to Run

```bash
python demo.py
```

**Dependencies:** Standard library only (`re`, `typing`). No external packages required.

## What This Demonstrates

This example implements **RAG quality evaluation metrics** inspired by the RAGAS (RAG Assessment) framework, measuring three key dimensions: faithfulness (are answer claims supported by retrieved context?), answer relevance (does the answer address the query?), and context precision (is the retrieved context actually useful?). It demonstrates how to automatically detect hallucination, irrelevance, and poor retrieval — critical capabilities for monitoring and improving RAG systems in production where answer quality directly impacts user trust.

## Code Walkthrough

### Key Functions

- **`extract_claims()`**: Extracts factual claims from an answer by splitting on sentence-ending punctuation (.!?) and filtering out sentences shorter than 10 characters. Each remaining sentence is treated as a separate claim to be verified against the context. This is a simplified approach — production systems would use NLP-based claim extraction.
- **`check_claim_in_context()`**: Checks if a claim is supported by any context chunk using word overlap. It converts both the claim and each context chunk to sets of lowercase words, computes the intersection ratio, and returns `True` if any context chunk has more than 50% word overlap with the claim.
- **`calculate_faithfulness()`**: Measures the fraction of answer claims that are supported by the retrieved context. Computed as `supported_claims / total_claims`. A low faithfulness score indicates hallucination — the answer contains information not present in the source context.
- **`calculate_answer_relevance()`**: Measures whether the answer addresses the query using keyword overlap. It extracts meaningful words (longer than 3 characters) from both the query and answer, then computes the fraction of query words that appear in the answer. A low score indicates the answer is off-topic.
- **`calculate_context_precision()`**: Measures the fraction of retrieved context chunks that are actually relevant to the query. For each context chunk, it checks if any query word appears in it. A low score means the retriever is fetching irrelevant documents.
- **`evaluate_rag()`**: Combines all three metrics into a single evaluation with a weighted overall score (faithfulness 40%, relevance 30%, precision 30%). Returns a detailed report including claim counts.

### Execution Flow (Step-by-Step)

1. **Define test data**: A query about Q3 revenue and margin, two context chunks containing financial data, and three test answers of varying quality.
2. **Evaluate good answer**: "Q3 revenue was $4.2 billion with 15% YoY growth. Operating margin was 28%."
   - Claims extracted: revenue figure, growth rate, margin figure.
   - All claims found in context → high faithfulness.
   - Query keywords ("revenue", "margin") present in answer → high relevance.
   - Both context chunks contain relevant keywords → high precision.
   - Overall score: high (well-supported, on-topic, relevant context).
3. **Evaluate hallucinated answer**: "Q3 revenue was $6.8 billion with 50% growth. Operating margin was 45%. The company acquired 3 startups."
   - Claims extracted: inflated revenue, inflated growth, inflated margin, acquisition claim.
   - Most claims NOT found in context → low faithfulness (hallucination detected).
   - Query keywords present → relevance still moderate.
   - Overall score: low (faithfulness penalty dominates).
4. **Evaluate irrelevant answer**: "The weather today is sunny with a high of 75 degrees."
   - Claims extracted: weather statement.
   - Not found in context → zero faithfulness.
   - No query keyword overlap → zero relevance.
   - Overall score: near zero (completely off-topic and unsupported).

### Important Variables

- `overlap > 0.5` threshold (in `check_claim_in_context()`): The minimum word overlap ratio for a claim to be considered "supported" by context. This threshold balances false positives (accepting unsupported claims) against false negatives (rejecting valid paraphrases).
- Weight coefficients (0.4, 0.3, 0.3): Faithfulness gets the highest weight because hallucination is the most critical failure mode in RAG systems.
- Word length filter (`> 3` characters): Filters out common short words (the, is, a, an, of, to) that add noise to overlap calculations without carrying semantic meaning.

## Key Takeaways

- **Faithfulness is the primary quality gate**: A RAG system's most important property is that its answers are grounded in retrieved context. Faithfulness directly measures hallucination — answers with claims not supported by context are fundamentally untrustworthy.
- **Three metrics capture different failure modes**: Faithfulness catches hallucination, relevance catches off-topic answers, and context precision catches poor retrieval. A good RAG system needs all three to be high.
- **Automated evaluation enables continuous monitoring**: These metrics can be computed automatically on every RAG response, enabling real-time quality dashboards and alerting when answer quality degrades — essential for production RAG systems.
- **Weighted overall score**: The 40/30/30 weighting prioritizes faithfulness because an unsupported answer is worse than an irrelevant one — users would rather get "I don't know" than a confident but wrong answer.
- **Simplified vs. production metrics**: The word-overlap approach used here is a heuristic — production RAGAS uses LLM-based evaluation for claim verification and semantic relevance, which is more accurate but more expensive. This example demonstrates the conceptual framework at minimal cost.
