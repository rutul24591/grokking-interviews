Example 1 is a production-style implementation demo for this data structure.

Implements a compact skip list to index leaderboard scores with probabilistic levels and ordered traversal.

It demonstrates:
- higher levels skip across large sorted regions
- insert preserves overall sorted order
- probabilistic balancing avoids full tree rotations
