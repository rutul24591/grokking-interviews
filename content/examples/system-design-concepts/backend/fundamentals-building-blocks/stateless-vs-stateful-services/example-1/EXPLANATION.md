Stateful services keep session data in memory, which ties clients to a specific node.
Stateless services embed session data in a token so any node can validate it.
The stateful server demonstrates session loss if the process restarts.
The stateless server demonstrates scaling without sticky sessions.
This is why stateless designs are preferred for horizontal scaling.
