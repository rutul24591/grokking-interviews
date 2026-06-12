# PdfViewer: recovery scenario

This example models the failure case where rapid scrolling left expensive renders queued for off-screen pages. The recovery plan is explicit: cancel stale render tasks, keep text-layer selection anchors, and prioritize the new visible window.
