# Edge case: conflicting version signals

In the context of API Versioning (api, versioning), this example provides a focused implementation of the concept below.

If you support multiple mechanisms (query/header/accept), define a precedence policy.

Without a policy, clients can “accidentally” move between versions and cause hard-to-debug incidents.

