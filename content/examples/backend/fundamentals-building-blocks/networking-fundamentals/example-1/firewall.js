// Firewall rules for simulated traffic.

const rules = [
  { action: "deny", cidr: "10.0.5.0/24" },
  { action: "allow", cidr: "10.0.0.0/8" },
];

function parseIpv4(ip) {
  return ip.split(".").map(Number).reduce((acc, part) => (acc << 8) + part, 0) >>> 0;
}

function cidrContains(cidr, ip) {
  const [base, bits] = cidr.split("/");
  const maskBits = Number(bits);
  const mask = maskBits === 0 ? 0 : 0xffffffff << (32 - maskBits);
  return (parseIpv4(base) & mask) === (parseIpv4(ip) & mask);
}

function allow(ip) {
  for (const rule of rules) {
    if (cidrContains(rule.cidr, ip)) {
      return rule.action === "allow";
    }
  }
  return false;
}

module.exports = { allow };
