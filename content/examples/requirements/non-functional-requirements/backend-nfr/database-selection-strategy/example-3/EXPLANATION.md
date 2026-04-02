# Focus

Sometimes the right strategy is **polyglot persistence**:

- Postgres for transactions
- Search engine for full-text
- Redis for caching

The key is to keep application code maintainable by hiding database specifics behind a small interface.

