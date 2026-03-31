This app exercises real browser CORS behavior instead of returning a synthetic allow/deny verdict.

- The allowed endpoint answers the browser preflight and sends `Access-Control-Allow-*` headers.
- The blocked endpoint returns JSON but omits CORS headers, so the browser rejects the response.
- The client uses `credentials: "include"` plus `Authorization`, which forces a real preflight before the main request.
