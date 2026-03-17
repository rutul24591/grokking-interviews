# Conflict Resolution for Offline Changes Examples

## Example 1: Last-Write-Wins (LWW) with Timestamps

```javascript
function lastWriteWins(localVersion, serverVersion) {
  // Simple: most recent timestamp wins
  if (localVersion.updatedAt > serverVersion.updatedAt) {
    return { ...serverVersion, ...localVersion, resolved: 'local-wins' };
  }
  return { ...localVersion, ...serverVersion, resolved: 'server-wins' };
}

// Field-level LWW (more granular, less data loss)
function fieldLevelLWW(local, server, ancestor) {
  const merged = { ...ancestor };

  const allKeys = new Set([...Object.keys(local), ...Object.keys(server)]);

  for (const key of allKeys) {
    if (key.endsWith('_updatedAt')) continue;

    const localChanged = local[key] !== ancestor[key];
    const serverChanged = server[key] !== ancestor[key];

    if (localChanged && !serverChanged) {
      merged[key] = local[key]; // Only local changed
    } else if (!localChanged && serverChanged) {
      merged[key] = server[key]; // Only server changed
    } else if (localChanged && serverChanged) {
      // Both changed — use field timestamp
      const localTime = local[`${key}_updatedAt`] || 0;
      const serverTime = server[`${key}_updatedAt`] || 0;
      merged[key] = localTime >= serverTime ? local[key] : server[key];
    }
  }

  return merged;
}
```

## Example 2: Three-Way Merge

```javascript
function threeWayMerge(ancestor, local, server) {
  const conflicts = [];
  const merged = { ...ancestor };

  for (const key of Object.keys(ancestor)) {
    const ancestorVal = JSON.stringify(ancestor[key]);
    const localVal = JSON.stringify(local[key]);
    const serverVal = JSON.stringify(server[key]);

    if (localVal === ancestorVal && serverVal === ancestorVal) {
      // No changes
    } else if (localVal !== ancestorVal && serverVal === ancestorVal) {
      merged[key] = local[key]; // Only local changed
    } else if (localVal === ancestorVal && serverVal !== ancestorVal) {
      merged[key] = server[key]; // Only server changed
    } else if (localVal === serverVal) {
      merged[key] = local[key]; // Both changed to same value
    } else {
      // True conflict: both changed to different values
      conflicts.push({
        field: key,
        ancestor: ancestor[key],
        local: local[key],
        server: server[key],
      });
    }
  }

  return { merged, conflicts };
}

// Usage
const result = threeWayMerge(
  { title: 'Original', body: 'Hello' },          // ancestor
  { title: 'Local Edit', body: 'Hello World' },   // local
  { title: 'Server Edit', body: 'Hello World' },  // server
);
// merged: { title: ??? (conflict), body: 'Hello World' (same change) }
// conflicts: [{ field: 'title', ancestor: 'Original', local: 'Local Edit', server: 'Server Edit' }]
```

## Example 3: Version Vector for Conflict Detection

```javascript
class VersionVector {
  constructor(clientId) {
    this.clientId = clientId;
    this.vector = {};
  }

  increment() {
    this.vector[this.clientId] = (this.vector[this.clientId] || 0) + 1;
    return { ...this.vector };
  }

  merge(otherVector) {
    for (const [client, version] of Object.entries(otherVector)) {
      this.vector[client] = Math.max(this.vector[client] || 0, version);
    }
  }

  // Returns: 'before', 'after', 'concurrent', 'equal'
  compare(otherVector) {
    let isBeforeOrEqual = true;
    let isAfterOrEqual = true;

    const allClients = new Set([
      ...Object.keys(this.vector),
      ...Object.keys(otherVector),
    ]);

    for (const client of allClients) {
      const mine = this.vector[client] || 0;
      const theirs = otherVector[client] || 0;

      if (mine < theirs) isAfterOrEqual = false;
      if (mine > theirs) isBeforeOrEqual = false;
    }

    if (isBeforeOrEqual && isAfterOrEqual) return 'equal';
    if (isBeforeOrEqual) return 'before';
    if (isAfterOrEqual) return 'after';
    return 'concurrent'; // True conflict!
  }
}

// Usage
const clientA = new VersionVector('A');
const clientB = new VersionVector('B');

clientA.increment(); // { A: 1 }
clientB.increment(); // { B: 1 }

const relation = clientA.compare(clientB.vector);
// 'concurrent' — both edited independently → conflict!
```

## Example 4: CRDT-Based Counter (G-Counter)

```javascript
// Grow-only counter CRDT — always converges, no conflicts
class GCounter {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.counts = {};
  }

  increment(amount = 1) {
    this.counts[this.nodeId] = (this.counts[this.nodeId] || 0) + amount;
  }

  value() {
    return Object.values(this.counts).reduce((sum, n) => sum + n, 0);
  }

  merge(other) {
    for (const [node, count] of Object.entries(other.counts)) {
      this.counts[node] = Math.max(this.counts[node] || 0, count);
    }
  }

  toJSON() {
    return { nodeId: this.nodeId, counts: { ...this.counts } };
  }
}

// Usage — two offline clients increment independently
const counterA = new GCounter('device-A');
const counterB = new GCounter('device-B');

counterA.increment(); // { device-A: 1 }
counterA.increment(); // { device-A: 2 }
counterB.increment(); // { device-B: 1 }

// When they sync — merge is commutative and idempotent
counterA.merge(counterB);
counterB.merge(counterA);

counterA.value(); // 3
counterB.value(); // 3 — same! No conflict possible.
```
