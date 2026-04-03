type SecretEvent = { actor: string; rotationApproved: boolean; secretExposed: boolean; auditLogged: boolean };

function assessRotationSafety(event: SecretEvent) {
  const unsafe = !event.rotationApproved || event.secretExposed || !event.auditLogged;
  return {
    actor: event.actor,
    unsafe,
    action: unsafe ? 'block-rotation-and-open-incident' : 'complete-rotation',
  };
}

const results = [
  { actor: 'release-bot', rotationApproved: true, secretExposed: false, auditLogged: true },
  { actor: 'operator', rotationApproved: false, secretExposed: false, auditLogged: true },
].map(assessRotationSafety);

console.table(results);
if (!results[1].unsafe) throw new Error('Unapproved rotation should be blocked');
