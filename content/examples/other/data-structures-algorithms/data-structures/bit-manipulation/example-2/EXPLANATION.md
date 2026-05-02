Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Counts enabled bits to answer questions like 'how many capabilities are active' without materializing a full boolean array.

It demonstrates:
- bit clearing removes the lowest set bit per iteration
- runtime scales with number of set bits, not bit width
- compact masks still support useful aggregate queries
