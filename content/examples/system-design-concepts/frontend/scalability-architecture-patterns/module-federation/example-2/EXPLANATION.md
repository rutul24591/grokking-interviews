## Why share-scope policies matter

If the host and remote each bundle their own copy of:
- React
- a design system
- runtime singletons (telemetry, router, i18n)

you can get:
- duplicated code and bigger bundles
- runtime errors (two Reacts in one page)
- split “global” state (two routers, two contexts)

Module Federation’s `shared` config is essentially a policy:
- choose one version (singleton) or allow multiple
- prefer highest, strict, or compatible versions

