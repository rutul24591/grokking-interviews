export class VersionVector {
  constructor(initial = {}) {
    this.vector = { ...initial };
  }

  fork(clientId) {
    return new ReplicaVector(clientId, this.vector);
  }

  snapshot() {
    return { ...this.vector };
  }
}

export class ReplicaVector {
  constructor(clientId, initial = {}) {
    this.clientId = clientId;
    this.vector = { ...initial };
  }

  tick() {
    this.vector[this.clientId] = (this.vector[this.clientId] || 0) + 1;
    return this.snapshot();
  }

  merge(other) {
    const merged = {};
    const clients = new Set([...Object.keys(this.vector), ...Object.keys(other)]);

    for (const client of clients) {
      merged[client] = Math.max(this.vector[client] || 0, other[client] || 0);
    }

    this.vector = merged;
    return this.snapshot();
  }

  compare(other) {
    let beforeOrEqual = true;
    let afterOrEqual = true;
    const clients = new Set([...Object.keys(this.vector), ...Object.keys(other)]);

    for (const client of clients) {
      const mine = this.vector[client] || 0;
      const theirs = other[client] || 0;
      if (mine < theirs) {
        afterOrEqual = false;
      }
      if (mine > theirs) {
        beforeOrEqual = false;
      }
    }

    if (beforeOrEqual && afterOrEqual) return "equal";
    if (beforeOrEqual) return "before";
    if (afterOrEqual) return "after";
    return "concurrent";
  }

  snapshot() {
    return { ...this.vector };
  }
}
