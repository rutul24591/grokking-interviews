# Avoiding “loading flicker”

Many products regress perceived performance by showing spinners for sub-100ms operations.

The fix is simple:
- delay showing indicators (threshold),
- pick the right indicator for the expected duration,
- and confirm via user behavior metrics.

