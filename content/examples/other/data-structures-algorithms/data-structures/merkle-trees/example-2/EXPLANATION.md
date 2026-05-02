Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Explains the follow-up use case of inclusion proofs, where a client verifies one leaf without downloading every chunk.

It demonstrates:
- a proof carries sibling hashes along the path to the root
- verification recomputes upward from the target leaf
- proof size grows logarithmically with leaf count
