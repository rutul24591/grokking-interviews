# WysiwygEmailBuilder: recovery scenario

This example models the failure case where the compiled template used unsupported layout behavior in an older mail client. The recovery plan is explicit: replace the unsupported block with a table-based fallback, preserve the design revision, and rerun client validation.
