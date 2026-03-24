## Why this is a “monorepo win”

In polyrepo, API and web often drift:
- API changes payloads
- web deploys later (or never)
- breakage is discovered in production

In a monorepo, you can:
- put schemas and types in `packages/contracts`
- update producer + consumer in one PR
- run CI on the whole graph

This reduces integration risk, but adds operational complexity:
- tooling (workspaces, caching)
- large CI graphs (needs selective builds)
- tighter coupling if boundaries are not enforced

