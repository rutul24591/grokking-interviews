This example focuses on **burn rate alerting**, which is the operational core of error budget management.

Instead of alerting on “SLO breached at end of month”, you alert on **how fast you’re burning budget**:

- Fast burn (short + long window) catches major incidents quickly.
- Slow burn catches persistent regressions that slowly drain budget.

The script demonstrates multi-window evaluation (5m/1h and 30m/6h) and prints whether alerts would fire.

