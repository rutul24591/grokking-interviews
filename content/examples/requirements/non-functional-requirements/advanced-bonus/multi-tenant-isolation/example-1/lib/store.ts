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

const TenantSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
  plan: z.enum(["free", "pro", "enterprise"]).default("free"),
  maxRps: z.number().int().min(1).max(50_000),
  maxConcurrent: z.number().int().min(1).max(10_000),
  dailyUnitBudget: z.number().int().min(1).max(1_000_000),
  behavior: BehaviorSchema,
});

export const ConfigSchema = z.object({
  mode: z.enum(["shared", "bulkhead"]).default("bulkhead"),
  globalMaxConcurrent: z.number().int().min(1).max(10_000).default(80),
  tenants: z.record(TenantSchema).default({}),
});

export type Config = z.infer<typeof ConfigSchema>;
export type TenantConfig = z.infer<typeof TenantSchema>;

type StoreState = {
  initialized: boolean;
  config: Config;
  writeChain: Promise<void>;
};

function getDataDir() {
  return path.join(process.cwd(), ".data");
}

function getPersistPath() {
  return path.join(getDataDir(), "tenant-config.json");
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

function createDefault(): Config {
  return ConfigSchema.parse({
    mode: "bulkhead",
    globalMaxConcurrent: 80,
    tenants: {
      "tenant-free": {
        id: "tenant-free",
        name: "Free Co",
        plan: "free",
        maxRps: 50,
        maxConcurrent: 10,
        dailyUnitBudget: 2000,
        behavior: {
          baseLatencyMs: 90,
          jitterMs: 25,
          tailPct: 0.08,
          tailLatencyMs: 500,
          errorRate: 0.01,
          errorStatus: 503,
        },
      },
      "tenant-enterprise": {
        id: "tenant-enterprise",
        name: "Enterprise Inc",
        plan: "enterprise",
        maxRps: 500,
        maxConcurrent: 40,
        dailyUnitBudget: 50_000,
        behavior: {
          baseLatencyMs: 70,
          jitterMs: 18,
          tailPct: 0.04,
          tailLatencyMs: 250,
          errorRate: 0.002,
          errorStatus: 503,
        },
      },
    },
  });
}

function createState(): StoreState {
  return {
    initialized: false,
    config: createDefault(),
    writeChain: Promise.resolve(),
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __tenantLabStore: StoreState | undefined;
}

function getState(): StoreState {
  if (!globalThis.__tenantLabStore) globalThis.__tenantLabStore = createState();
  return globalThis.__tenantLabStore;
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

export async function getConfig() {
  await initStore();
  return getState().config;
}

export async function setConfig(next: Config) {
  await initStore();
  const state = getState();
  state.config = ConfigSchema.parse(next);
  state.writeChain = state.writeChain.then(() => persist(state));
  await state.writeChain;
  return state.config;
}

