function toneForIncident(incident) {
  if (incident.recoverable && incident.userActionAvailable) {
    return { tone: "recoverable", action: "retry" };
  }

  if (incident.recoverable) {
    return { tone: "recoverable", action: "refresh" };
  }

  return { tone: "blocking", action: "contact-support" };
}

console.log(toneForIncident({ recoverable: true, userActionAvailable: false }));
