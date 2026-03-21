This example focuses on the core of canaries: **deterministic bucketing**.

Requirements this solves:

- **Sticky**: the same user is consistently assigned to the same variant.
- **Controllable**: changing `canaryPct` smoothly changes the number of canary users.
- **Auditable**: routing is explainable (pure function of userId + salt + pct).

The demo prints:

- how many users land in baseline vs canary for different percentages
- a stability check showing that assignment is unchanged when config is unchanged

