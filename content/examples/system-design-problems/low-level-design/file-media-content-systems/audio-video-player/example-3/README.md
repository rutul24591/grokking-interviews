# AudioVideoPlayer: recovery scenario

This example models the failure case where buffer-ahead dropped below the rebuffer threshold. The recovery plan is explicit: pause decoding, fetch the next bitrate-compatible segment, then resume from the committed playhead.
