## Why singleflight is required

When an access token expires, many concurrent requests can all see 401 and trigger refresh.
Singleflight prevents:
- thundering herd on refresh endpoint
- refresh token rotation races

