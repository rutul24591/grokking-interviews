Requests move through middleware before hitting business logic.
This pipeline logs timing, validates input, and enforces auth.
Handlers return data, which is serialized into the response body.
Errors are caught early and turned into consistent responses.
The example mirrors typical server frameworks and API gateways.
