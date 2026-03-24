## Module Federation — Example 2: Version negotiation (share scope simulation)

This example focuses on a sub-problem: **how a host and remote decide what versions to use** for shared dependencies.

It’s a simplified simulation that mirrors real concerns:
- avoid shipping multiple React copies
- enforce “singleton” libraries
- deal with semver drift across independently deployed apps

### Run
```bash
pnpm i
pnpm start
```

