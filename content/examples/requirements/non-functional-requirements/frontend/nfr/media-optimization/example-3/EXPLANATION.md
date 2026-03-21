# Media budgets are an NFR contract

“We optimize images” often degrades over time as new pages/features ship. Budget checks create an
explicit contract:

- total bytes per asset type (images, fonts, video),
- max bytes per single hero asset,
- and max number of variants per breakpoint.

Budgets are also a forcing function for product decisions (e.g., do we really need autoplay video?).

