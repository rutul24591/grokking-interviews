## Event-Driven Architecture — Example 2: In-process event bus with backpressure

Example 1 showed server→client streaming. This example focuses on a **local event bus** you’d use inside a frontend “micro-architecture” to decouple modules (analytics, toasts, feature modules) while preventing handler overload.

### Run
```bash
pnpm i
pnpm start
```

