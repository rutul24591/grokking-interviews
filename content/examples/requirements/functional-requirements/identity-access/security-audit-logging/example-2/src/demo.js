function redact(event) {
  return { ...event, ip: "[redacted]", email: event.email.replace(/(^.).*(@.*$)/, "$1***$2") };
}

console.log(redact({ email: "avery@example.com", ip: "10.0.0.12" }));
