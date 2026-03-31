# What this example shows

Cancellation alone is not enough. Some responses still arrive after the abort signal is issued or after adapters have already buffered data. This check enforces the second safety net: apply only the response that matches the latest active request id.
