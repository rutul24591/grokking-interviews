# Realtime UI handling as a frontend NFR

Realtime UX is an NFR because it must stay correct under:
- reconnects,
- duplicates/out-of-order delivery,
- and backpressure.

This example uses SSE:
- server streams new messages and pings,
- client reconnects with exponential backoff,
- client resumes by cursor (and dedupes by cursor).

