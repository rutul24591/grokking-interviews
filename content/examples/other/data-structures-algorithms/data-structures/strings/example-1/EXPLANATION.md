Example 1 is a production-style implementation demo for this data structure.

Builds a small string-processing pipeline for search queries, covering trimming, normalization, tokenization, and canonical formatting.

It demonstrates:
- normalization standardizes inputs before indexing or matching
- tokenization is deterministic across similar user inputs
- string work is often pipeline-oriented rather than random-access heavy
