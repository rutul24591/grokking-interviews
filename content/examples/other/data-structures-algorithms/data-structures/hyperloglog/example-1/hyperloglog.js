function simpleHash(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function leadingZeros32(value) {
  return Math.clz32(value) + 1;
}

class HyperLogLog {
  constructor(registerBits = 4) {
    this.registerBits = registerBits;
    this.registerCount = 1 << registerBits;
    this.registers = new Array(this.registerCount).fill(0);
  }

  add(value) {
    const hash = simpleHash(value);
    const register = hash & (this.registerCount - 1);
    const remainder = hash >>> this.registerBits;
    this.registers[register] = Math.max(
      this.registers[register],
      leadingZeros32(remainder || 1),
    );
  }

  estimate() {
    const alpha = 0.673;
    const harmonic = this.registers.reduce(
      (sum, value) => sum + 2 ** -value,
      0,
    );
    return Math.round(alpha * this.registerCount ** 2 / harmonic);
  }
}

module.exports = { HyperLogLog };
