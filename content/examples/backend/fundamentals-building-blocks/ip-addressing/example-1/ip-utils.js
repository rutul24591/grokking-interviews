// Utilities for parsing IPs and checking CIDR containment.

const IPV4_PARTS = 4;

function parseIpv4(ip) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== IPV4_PARTS || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return null;
  }
  return parts.reduce((acc, part) => (acc << 8) + part, 0) >>> 0;
}

function parseIpv6(ip) {
  // Expand shorthand IPv6 and return a 128-bit array (4 x 32-bit parts).
  const sections = ip.split("::");
  if (sections.length > 2) return null;
  const left = sections[0] ? sections[0].split(":") : [];
  const right = sections[1] ? sections[1].split(":") : [];
  const missing = 8 - (left.length + right.length);
  if (missing < 0) return null;
  const full = [...left, ...Array(missing).fill("0"), ...right];
  const parts = full.map((part) => parseInt(part || "0", 16));
  if (parts.some((n) => Number.isNaN(n) || n < 0 || n > 0xffff)) return null;
  const words = [];
  for (let i = 0; i < 8; i += 2) {
    words.push((parts[i] << 16) | parts[i + 1]);
  }
  return words;
}

function isPrivateIpv4(ip) {
  const value = parseIpv4(ip);
  if (value === null) return false;
  return (
    (value >>> 24) === 10 ||
    (value >>> 20) === (172 << 4) + 1 ||
    (value >>> 16) === (192 << 8) + 168
  );
}

function cidrContainsIpv4(cidr, ip) {
  const [base, bits] = cidr.split("/");
  const baseVal = parseIpv4(base);
  const ipVal = parseIpv4(ip);
  const maskBits = Number(bits);
  if (baseVal === null || ipVal === null || Number.isNaN(maskBits)) return false;
  const mask = maskBits === 0 ? 0 : 0xffffffff << (32 - maskBits);
  return (baseVal & mask) === (ipVal & mask);
}

function cidrContainsIpv6(cidr, ip) {
  const [base, bitsRaw] = cidr.split("/");
  const baseVal = parseIpv6(base);
  const ipVal = parseIpv6(ip);
  const bits = Number(bitsRaw);
  if (!baseVal || !ipVal || Number.isNaN(bits)) return false;
  let remaining = bits;
  for (let i = 0; i < 4; i += 1) {
    const chunkBits = Math.min(32, remaining);
    if (chunkBits === 0) break;
    const mask = chunkBits === 32 ? 0xffffffff : 0xffffffff << (32 - chunkBits);
    if ((baseVal[i] & mask) !== (ipVal[i] & mask)) return false;
    remaining -= chunkBits;
  }
  return true;
}

module.exports = {
  parseIpv4,
  parseIpv6,
  isPrivateIpv4,
  cidrContainsIpv4,
  cidrContainsIpv6,
};
