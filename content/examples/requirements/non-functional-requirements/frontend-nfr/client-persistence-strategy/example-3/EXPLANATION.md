In the context of Client Persistence Strategy (client, persistence, strategy), this example provides a focused implementation of the concept below.

When state persists and syncs across devices, conflicts are inevitable. You need an explicit merge policy (LWW, 3-way merge, CRDT) that matches your product’s correctness requirements.

