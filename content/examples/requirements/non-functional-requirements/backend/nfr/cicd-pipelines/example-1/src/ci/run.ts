import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function waitForHealthy(baseUrl: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(baseUrl + "/api/health", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.ok === true) return;
      }
    } catch {
      // ignore
    }
    await delay(250);
  }
  throw new Error(`server did not become healthy within ${timeoutMs}ms`);
}

function run(cmd: string, args: string[], env: NodeJS.ProcessEnv) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", env });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function main() {
  const ciEnv: NodeJS.ProcessEnv = {
    ...process.env,
    CI: "true",
    NEXT_TELEMETRY_DISABLED: "1"
  };

  const gitSha =
    process.env.GIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    `local-${Date.now().toString(36)}`;
  const buildId = process.env.BUILD_ID || process.env.GITHUB_RUN_ID || `run-${Date.now()}`;
  ciEnv.NEXT_PUBLIC_GIT_SHA = gitSha;
  ciEnv.NEXT_PUBLIC_BUILD_ID = buildId;

  console.log(JSON.stringify({ step: "lint" }));
  await run("pnpm", ["lint"], ciEnv);

  console.log(JSON.stringify({ step: "build" }));
  await run("pnpm", ["build"], ciEnv);

  const port = Number(process.env.PORT || 3100);
  const baseUrl = `http://localhost:${port}`;

  console.log(JSON.stringify({ step: "start", baseUrl }));
  const server = spawn("pnpm", ["start", "-p", String(port)], { stdio: "inherit", env: ciEnv });

  let serverExited = false;
  server.on("exit", () => {
    serverExited = true;
  });

  try {
    await waitForHealthy(baseUrl, 20_000);
    assert(!serverExited, "server exited before becoming healthy");

    console.log(JSON.stringify({ step: "smoke" }));
    await run("pnpm", ["agent:run", "--", "--baseUrl", baseUrl], ciEnv);

    console.log(JSON.stringify({ ok: true, promoted: true, buildId, gitSha }, null, 2));
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

