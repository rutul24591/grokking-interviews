# StreamingMarkdownRenderer: protocol scenario

This example implements the normal streaming markdown projection transition flow. It rejects out-of-order commands, ignores duplicate revisions idempotently, and records an audit trail. The central invariant is: Never render an incomplete fenced block or unsanitized HTML fragment.
