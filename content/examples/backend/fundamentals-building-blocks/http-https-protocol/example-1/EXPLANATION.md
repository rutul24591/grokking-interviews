HTTP defines the request/response semantics; HTTPS adds TLS for confidentiality and integrity.
The HTTP server shows routing, headers, status codes, and a JSON response body.
The HTTPS server uses the same handler logic, but the transport is encrypted.
The client demonstrates that HTTP and HTTPS are accessed the same way at the API layer.
TLS protects against eavesdropping and tampering while data is in transit.
Self-signed certificates are acceptable for local demos but not for production.
