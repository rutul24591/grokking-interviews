function recoveryPath({ verified, backupCodesRemaining, attemptsRemaining }) {
  if (verified) return "complete";
  if (attemptsRemaining === 0 && backupCodesRemaining > 0) return "fall-back-to-backup-codes";
  if (attemptsRemaining === 0) return "restart-enrollment";
  return "retry-authenticator-code";
}

console.log(recoveryPath({ verified: false, backupCodesRemaining: 8, attemptsRemaining: 0 }));
console.log(recoveryPath({ verified: false, backupCodesRemaining: 0, attemptsRemaining: 1 }));
