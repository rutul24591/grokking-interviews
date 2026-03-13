This example models routing, NAT, and firewall decisions.
Packets from private IPs are translated to a public IP by NAT.
The router chooses next hops based on destination prefixes.
The firewall enforces allow/deny rules before forwarding.
This mirrors how many backend services sit behind NAT and firewall layers.
