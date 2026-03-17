This example separates client, server, service, and repository to show layered responsibilities.
The client sends HTTP requests and only depends on the public API contract.
The server enforces the contract and translates HTTP into service calls.
The service owns business rules and returns domain data, not HTTP responses.
The repository abstracts data access so persistence can change without touching the service.
A stateful session endpoint shows how server-held state affects scaling and failover.
Stateless item endpoints demonstrate why stateless services are easier to scale horizontally.
Consistent error shapes make client behavior predictable even during failures.
