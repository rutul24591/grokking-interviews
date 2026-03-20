import { mintCsrfSecret, mintToken, verifyToken } from "./csrf";

// “double submit cookie” idea:
// - server sets cookie csrf=<token>
// - form includes hidden input csrf=<token>
// - on POST, compare both and verify signature.

const secret = mintCsrfSecret();
const sessionId = "sess_123";

const token = mintToken(secret, sessionId);
const cookieToken = token; // cookie value
const formToken = token; // hidden input value

const ok = cookieToken === formToken && verifyToken(secret, formToken, sessionId);
console.log({ ok });

const attacker = mintToken(secret, "sess_other");
console.log({
  attackOk: attacker === cookieToken && verifyToken(secret, attacker, sessionId),
});

