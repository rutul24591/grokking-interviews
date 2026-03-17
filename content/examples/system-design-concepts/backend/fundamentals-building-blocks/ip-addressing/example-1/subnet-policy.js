// Allow/deny policy using CIDR ranges.

const { cidrContainsIpv4, cidrContainsIpv6 } = require("./ip-utils");

const policy = {
  allow: ["10.0.0.0/8", "192.168.0.0/16", "2001:db8::/32"],
  deny: ["10.0.5.0/24"],
};

function isAllowed(ip) {
  const isV6 = ip.includes(":");
  const contains = isV6 ? cidrContainsIpv6 : cidrContainsIpv4;

  if (policy.deny.some((cidr) => contains(cidr, ip))) {
    return false;
  }

  return policy.allow.some((cidr) => contains(cidr, ip));
}

module.exports = { isAllowed };
