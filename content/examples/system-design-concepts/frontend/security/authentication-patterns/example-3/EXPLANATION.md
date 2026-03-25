## Session fixation

If an attacker can cause a victim to use a session id the attacker knows, and you don’t rotate session ids on login,
the attacker can “fix” the victim into a known session and later hijack it.

Mitigation:
- always issue a new session id after authentication
- bind sessions to user context (ip/device signals) when appropriate

