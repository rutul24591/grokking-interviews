## What this models

In polyrepo, it’s common to:
- ship an API change
- have old web clients still calling it
- discover drift via runtime failures

Zod (or any runtime validation) makes the failure explicit and helps you:
- measure breakage
- add backwards-compatible transforms
- roll out safely with versioning

