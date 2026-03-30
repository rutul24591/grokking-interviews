export function createLeaderLease() {
  let activeOwner = null;

  return {
    claim(ownerId) {
      if (activeOwner && activeOwner !== ownerId) {
        return { acquired: false, ownerId: activeOwner };
      }

      activeOwner = ownerId;
      return { acquired: true, ownerId };
    },
    release(ownerId) {
      if (activeOwner === ownerId) {
        activeOwner = null;
      }
    },
    currentOwner() {
      return activeOwner;
    }
  };
}
