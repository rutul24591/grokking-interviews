# Focus

In the context of Multi Region Replication (multi, region, replication), this example provides a focused implementation of the concept below.

Vector clocks can detect whether two writes are:

- ordered (one happened-before the other)
- concurrent (conflict)

This is useful when LWW would silently drop user updates.

