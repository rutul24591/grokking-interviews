# AudioVideoPlayer: protocol scenario

This example implements the normal playback session transition flow. It rejects out-of-order commands, ignores duplicate revisions idempotently, and records an audit trail. The central invariant is: Never advance the playhead beyond the buffered range.
