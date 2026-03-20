Example 3 demonstrates a real-world edge case: **buffering intermediaries** can defeat streaming SSR.

It spins up:
- an **origin** server that streams HTML chunks over time
- a **streaming proxy** that pipes chunks through (streaming preserved)
- a **buffering proxy** that reads the entire origin response first (streaming defeated)

This is why production streaming SSR requires careful configuration across:
- CDNs (buffering / HTML streaming support)
- reverse proxies
- compression layers (some gzip configs buffer)
- observability (TTFB vs last-byte / full render time)

