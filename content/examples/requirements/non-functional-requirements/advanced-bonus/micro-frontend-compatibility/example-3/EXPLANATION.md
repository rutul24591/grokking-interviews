This example models a **compatibility matrix**: whether a given host contract version can run a given remote major version.

In production you use this for:
- safe rollouts (don’t load incompatible remotes)
- staged deprecations (drop support intentionally)
- CI checks (remote PRs validate against supported hosts)

