# ImageGalleryLightbox: protocol scenario

This example implements the normal lightbox projection transition flow. It rejects out-of-order commands, ignores duplicate revisions idempotently, and records an audit trail. The central invariant is: Keep navigation index stable while late image decodes are ignored by request generation.
