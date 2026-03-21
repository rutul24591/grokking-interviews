import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

const BehaviorSchema = z.object({
  baseLatencyMs: z.number().int().min(0).max(10_000).default(80),
  jitterMs: z.number().int().min(0).max(10_000).default(20),
  tailPct: z.number().min(0).max(1).default(0.05),
  tailLatencyMs: z.number().int().min(0).max(60_000).default(300),
  errorRate: z.number().min(0).max(1).default(0.002),
  errorStatus: z.number().int().min(400).max(599).default(503),
});

export const ConfigSchema = z.object({
  routing: z.object({
    canaryPct: z.number().min(0).max(100).default(5),
    salt: z.string().min(1).max(80).default("rollout-1"),
  }),
  guardrails: z.object({
    maxErrorRateDelta: z.number().min(0).max(1).default(0.01),
    maxP95DeltaMs: z.number().int().min(0).max(60_000).default(80),
  }),
  behavior: z.object({
    baseline: BehaviorSchema.default({}),
    canary: BehaviorSchema.default({
      baseLatencyMs: 90,
      jitterMs: 25,
      tailPct: 0.07,
      tailLatencyMs: 450,
      errorRate: 0.01,
      errorStatus: 503,
    }),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

type StoreState = {
  initialized: boolean;
  config: Config;
  writeChain: Promise<void>;
};

function getDataDir() {
  return path.join(process.cwd(), ".data");
}

function getPersistPath() {
  return path.join(getDataDir(), "canary-config.json");
}

function ensureDirSync(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function safeReadJson(p: string): unknown | null {
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8")) as unknown;
  } catch {
    return null;
  }
}

function createState(): StoreState {
  return {
    initialized: false,
    config: ConfigSchema.parse({}),
    writeChain: Promise.resolve(),
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __canaryLabStore: StoreState | undefined;
}

function getState(): StoreState {
  if (!globalThis.__canaryLabStore) globalThis.__canaryLabStore = createState();
  return globalThis.__canaryLabStore;
}

async function persist(state: StoreState) {
  ensureDirSync(getDataDir());
  fs.writeFileSync(getPersistPath(), JSON.stringify(state.config, null, 2) + "\n", "utf-8");
}

export async function initStore() {
  const state = getState();
  if (state.initialized) return;
  const raw = safeReadJson(getPersistPath());
  if (raw) state.config = ConfigSchema.parse(raw);
  state.initialized = true;
}

export async function getConfig(): Promise<Config> {
  await initStore();
  return getState().config;
}

export async function setConfig(input: unknown): Promise<Config> {
  await initStore();
  const parsed = ConfigSchema.parse(input);
  const state = getState();
  state.config = parsed;
  state.writeChain = state.writeChain.then(() => persist(state));
  await state.writeChain;
  return parsed;
}

