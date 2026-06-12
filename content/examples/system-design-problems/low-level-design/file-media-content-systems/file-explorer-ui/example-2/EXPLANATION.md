# FileExplorerUi: protocol scenario

This example implements the normal directory projection transition flow. It rejects out-of-order commands, ignores duplicate revisions idempotently, and records an audit trail. The central invariant is: Reject moves that place a directory inside one of its descendants.
