Example 1 is a full app showing request deduplication at the component level.

It keeps one shared in-flight promise per normalized key so sibling consumers do not multiply identical network traffic.
