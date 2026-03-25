import { randomUUID } from "node:crypto";

function loginWithoutRotation(existingSessionId) {
  // Bad: keeps the same session id across auth boundary.
  return { sessionId: existingSessionId, authenticated: true };
}

function loginWithRotation() {
  // Good: new random session id after auth.
  return { sessionId: randomUUID(), authenticated: true };
}

const attackerKnown = "sess_attacker_knows";
process.stdout.write(`victim starts with sessionId=${attackerKnown}\n`);

const bad = loginWithoutRotation(attackerKnown);
process.stdout.write(`BAD login keeps sessionId=${bad.sessionId}\n`);

const good = loginWithRotation();
process.stdout.write(`GOOD login rotates sessionId=${good.sessionId}\n`);

