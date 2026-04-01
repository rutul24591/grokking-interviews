function recoveryMessage(accountExists) {
  return {
    outwardMessage: "If the account exists, recovery instructions were sent.",
    auditReason: accountExists ? "token-issued" : "identifier-miss",
  };
}

console.log(recoveryMessage(true));
console.log(recoveryMessage(false));
