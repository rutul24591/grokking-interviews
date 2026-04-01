function rollbackRequired(previous, next, sessionCount) {
  return previous.mfaRequired && !next.mfaRequired && sessionCount > 0;
}

console.log(rollbackRequired({ mfaRequired: true }, { mfaRequired: false }, 2));
console.log(rollbackRequired({ mfaRequired: true }, { mfaRequired: true }, 2));
