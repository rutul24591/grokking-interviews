# ImageGalleryLightbox: recovery scenario

This example models the failure case where a slow decode completed after the user navigated twice. The recovery plan is explicit: ignore the stale decode generation, retain the current index, and continue prefetching adjacent assets.
