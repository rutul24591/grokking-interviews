function createServices({ now = () => Date.now() } = {}) {
  return {
    clock: { now },
    logger: { info: (msg) => process.stdout.write(`[info] ${msg}\n`) }
  };
}

function createHandler(services) {
  return () => {
    services.logger.info(`request at ${services.clock.now()}`);
    return { ok: true, ts: services.clock.now() };
  };
}

const real = createHandler(createServices());
process.stdout.write(`real: ${JSON.stringify(real())}\n`);

// “Test”
const fake = createHandler(createServices({ now: () => 123 }));
process.stdout.write(`test: ${JSON.stringify(fake())}\n`);

