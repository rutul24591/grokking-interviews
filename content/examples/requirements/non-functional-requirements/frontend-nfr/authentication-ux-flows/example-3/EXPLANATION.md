In the context of Authentication UX Flows (authentication, ux, flows), this example provides a focused implementation of the concept below.

Refresh token rotation limits the blast radius of token theft.

Key idea shown here:
- each refresh token belongs to a **family**
- rotating invalidates the old token
- if the old token is ever used again, treat it as **reuse** and revoke the entire family

This is a common production defense against replay in the presence of refresh token exfiltration.

