# FileExplorerUi: recovery scenario

This example models the failure case where an optimistic move conflicted with a newer server tree revision. The recovery plan is explicit: restore the last committed tree, replay the permitted move against the new revision, and preserve expansion state.
