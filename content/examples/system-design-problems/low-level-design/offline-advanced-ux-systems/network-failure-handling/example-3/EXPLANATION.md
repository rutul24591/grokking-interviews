# Explanation

This example supports Design Network Failure Handling. It demonstrates connectivity and request health coordinator, the invariant "The UI should degrade based on observed reachability, not a single unreliable online boolean.", and the production edge case where navigator.onLine says online while the API is unreachable behind a captive portal or regional outage. Use it to discuss API shape, state transitions, retry behavior, conflict handling, privacy scoping, and observability.
