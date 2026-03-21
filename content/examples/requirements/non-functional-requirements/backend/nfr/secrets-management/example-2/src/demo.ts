function redact(obj: any) {
  const text = JSON.stringify(obj);
  return text.replace(/(secret|token|password)\\s*[:=]\\s*\"[^\"]+\"/gi, '$1:"[REDACTED]"');
}

console.log(
  redact({
    token: "Bearer abc",
    password: "p@ssw0rd",
    safe: "hello"
  })
);

