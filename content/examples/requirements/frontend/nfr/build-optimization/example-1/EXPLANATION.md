Build optimization is often less about micro-tweaks and more about **boundaries**:
- avoid importing “admin/heavy” features in your default path,
- use dynamic import for optional functionality,
- and keep modules side-effect-free so they’re easy to split and tree-shake.

This example uses a “heavy” module that increments a global load counter on import to make load behavior observable.

