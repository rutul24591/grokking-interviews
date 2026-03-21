type Decision = { allowed: boolean; reason?: string };

function check(perUser: Decision, perIp: Decision) {
  if (!perUser.allowed) return { allowed: false, reason: "per_user" };
  if (!perIp.allowed) return { allowed: false, reason: "per_ip" };
  return { allowed: true };
}

console.log(JSON.stringify({ ok: check({ allowed: true }, { allowed: false }) }, null, 2));

