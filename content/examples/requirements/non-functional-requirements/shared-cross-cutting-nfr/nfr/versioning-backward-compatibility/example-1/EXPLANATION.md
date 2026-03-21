This is a runnable API versioning + backward compatibility demo:

- Two API versions (`/api/v1/profile` and `/api/v2/profile`) with different shapes.
- A compatibility shim so a v1 client can still read data written by v2 (and vice versa).
- Deprecation signaling on v1 responses (headers you’d use in real rollouts).
- A Node agent that verifies cross-version semantics.

