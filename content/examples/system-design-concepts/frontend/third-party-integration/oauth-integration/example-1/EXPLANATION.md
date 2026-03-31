This app covers the standard frontend OAuth integration flow:

- the browser begins a redirect-based login
- the backend issues and stores a `state` token
- the callback code is exchanged through the backend
- authenticated user identity is returned only after state validation
