This app demonstrates a production-style payment integration:

- the browser creates a checkout session through the backend
- the payment provider redirect is modeled as an external URL
- final payment state is read back from the backend, not trusted from client redirect params alone
