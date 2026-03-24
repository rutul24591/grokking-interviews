## Singleton in modern web runtimes

Singleton means “one instance per process”. In frontend systems design you see it as:
- in-memory caches
- connection pools
- loggers/telemetry clients

But there are sharp edges:
- In serverless/edge, there may be **many processes** (many “singletons”).
- Hot reload in dev can create multiple module instances unless you pin to `globalThis`.
- Singletons make testing harder (hidden dependencies).

This example uses a safe pattern:
- store the instance on `globalThis` to survive module reloads in dev
- keep the singleton’s surface area small and explicit

