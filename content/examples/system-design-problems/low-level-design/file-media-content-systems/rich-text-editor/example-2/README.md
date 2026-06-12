# RichTextEditor: protocol scenario

This example implements the normal rich-text transaction log transition flow. It rejects out-of-order commands, ignores duplicate revisions idempotently, and records an audit trail. The central invariant is: Normalize document structure after every transaction without losing the logical selection bookmark.
