This app shows the real frontend analytics integration path:

- page and interaction events are created in the browser
- collection is gated on user consent
- sensitive fields are stripped before the batch is sent to the collector
- events are flushed to a dedicated ingestion API instead of firing one request per interaction
