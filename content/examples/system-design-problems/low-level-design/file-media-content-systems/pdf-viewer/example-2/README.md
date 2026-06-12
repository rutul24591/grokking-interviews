# PdfViewer: protocol scenario

This example implements the normal document viewport transition flow. It rejects out-of-order commands, ignores duplicate revisions idempotently, and records an audit trail. The central invariant is: Render only a bounded visible-page window and cancel work for pages leaving that window.
