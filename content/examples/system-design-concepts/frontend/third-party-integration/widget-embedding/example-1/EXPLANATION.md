This app embeds a widget through an iframe and treats cross-origin communication as untrusted by default.

- widget UI stays isolated from the host page
- the host accepts only trusted-origin resize messages
- the iframe boundary prevents vendor code from mutating the main application shell directly
