# Choosing a strategy

The core driver is cacheability:
- personalization → SSR
- shared content → static/ISR

Then optimize for SEO and interaction patterns. Many real systems use a hybrid: SSR shell + client “islands”.

