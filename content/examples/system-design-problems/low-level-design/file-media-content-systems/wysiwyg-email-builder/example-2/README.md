# WysiwygEmailBuilder: protocol scenario

This example implements the normal email design document transition flow. It rejects out-of-order commands, ignores duplicate revisions idempotently, and records an audit trail. The central invariant is: Publish a versioned design only when generated HTML passes the supported email-client capability policy.
