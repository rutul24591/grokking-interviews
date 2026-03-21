In the context of Build Optimization (build, optimization), this example provides a focused implementation of the concept below.

Barrel files (`index.ts`) can accidentally pull large modules into common import paths and reduce tree-shaking effectiveness—especially with `export *`.

This demo scans a small in-memory file set for `export *` barrels.

