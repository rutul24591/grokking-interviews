# What this example shows

This app demonstrates the simplest periodic polling model:

- the browser polls at a fixed interval
- the server returns the latest snapshot
- no connection stays open between polls

It is a pragmatic choice when update latency can tolerate seconds instead of instant push.
