function userSafeMessage(incident) {
  const unsafe = /stack|exception|trace|sql|token/i.test(incident.internalMessage);
  return {
    message: unsafe ? "Something went wrong. Please try again." : incident.internalMessage,
    supportCode: incident.correlationId
  };
}

console.log(userSafeMessage({ internalMessage: "TypeError stack trace line 42", correlationId: "req-9a1" }));
