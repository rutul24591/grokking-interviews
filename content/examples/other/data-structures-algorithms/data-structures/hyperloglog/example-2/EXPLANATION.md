Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Shows the follow-up property that makes HyperLogLog operationally useful: independent sketches can be merged register-wise.

It demonstrates:
- merge keeps the maximum register value per position
- partitioned counting avoids shipping raw identities
- merged estimates remain approximate but scalable
