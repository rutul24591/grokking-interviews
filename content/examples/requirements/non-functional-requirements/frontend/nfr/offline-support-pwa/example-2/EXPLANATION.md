# Why SWR works well for offline reads

SWR is a good default for read endpoints that:
- users open frequently,
- can tolerate slightly stale data,
- and must remain usable offline.

It gives “instant” UI from cache and opportunistically refreshes when the network allows.

