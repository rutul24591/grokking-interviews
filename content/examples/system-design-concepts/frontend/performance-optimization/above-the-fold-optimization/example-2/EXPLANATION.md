Example 2 isolates one of the highest-impact above-the-fold bugs: shipping a lazy-loaded LCP image without intrinsic dimensions.

The script audits actual hero-image markup and flags the concrete failures that hurt LCP and CLS:
- lazy loading the hero image
- missing width/height
- missing `fetchpriority="high"`
