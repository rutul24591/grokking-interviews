Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Forces collisions so the follow-up makes the bucket-chain trade-off visible instead of assuming a perfect hash.

It demonstrates:
- multiple keys can occupy the same bucket without data loss
- collision-heavy workloads degrade toward linear bucket scans
- observability into bucket state helps detect poor key distribution
