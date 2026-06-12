# RichTextEditor: recovery scenario

This example models the failure case where a paste introduced unsupported nested nodes and an invalid selection path. The recovery plan is explicit: sanitize the pasted subtree, normalize schema violations, and resolve the selection bookmark to the nearest valid text position.
