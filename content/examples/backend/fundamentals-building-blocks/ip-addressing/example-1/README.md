# IP Addressing Example

This example shows IPv4/IPv6 parsing, CIDR math, and subnet allow/deny checks that are common in backend access controls.

## Files
- `ip-utils.js`: IPv4/IPv6 parsing and CIDR utilities.
- `subnet-policy.js`: Allow/deny policy with CIDR ranges.
- `client.js`: Example checks.

## Run
`node content/examples/backend/fundamentals-building-blocks/ip-addressing/example-1/client.js`

## What to look for
- CIDR containment logic.
- Private vs public range detection.
- IPv6 normalization handling.
