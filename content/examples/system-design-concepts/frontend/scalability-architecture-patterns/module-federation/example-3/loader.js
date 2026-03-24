async function loadWithTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
  return Promise.race([promise, timeout]);
}

async function loadRemoteModule() {
  // Simulate a remote load that might be slow/unavailable.
  // In real federation, this is "load remoteEntry" + "init share scope" + "get module".
  await new Promise((r) => setTimeout(r, 200));
  return { render: () => "REMOTE module rendered" };
}

function loadFallbackModule() {
  return { render: () => "FALLBACK module rendered" };
}

try {
  const mod = await loadWithTimeout(loadRemoteModule(), 100);
  process.stdout.write(`${mod.render()}\n`);
} catch {
  const fallback = loadFallbackModule();
  process.stdout.write(`${fallback.render()}\n`);
}

