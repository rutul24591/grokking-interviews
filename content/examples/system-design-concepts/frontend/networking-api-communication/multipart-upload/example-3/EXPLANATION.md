# What this example shows

Multipart upload is valuable because failures are local to a single part. This script checks the resume path: only failed parts are retried, while completed parts stay committed.
