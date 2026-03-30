for (const raw of ['{"version":2,"settings":{"theme":"dark"}}', '{broken-json']) {
  try {
    console.log({ raw, parsed: JSON.parse(raw) });
  } catch {
    console.log({ raw, fallback: 'use-default-settings' });
  }
}
