# Avoiding request waterfalls

Waterfalls are a frequent root cause of slow pages:
- sequential dependencies,
- chained API calls,
- “UI composed from many small endpoints”.

Prefer batching, parallel fetch, or server-side composition where appropriate.

