import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

const FaultSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("latency"), latencyMs: z.number().int().min(0).max(60_000) }),
  z.object({ type: z.literal("error"), errorStatus: z.number().int().min(400).max(599) }),
  z.object({ type: z.literal("timeout"), timeoutMs: z.number().int().min(0).max(120_000) }),
]);

const HypothesisSchema = z.object({
  maxErrorRate: z.number().min(0).max(1),
  maxP95Ms: z.number().int().min(0).max(120_000),
});

export const CreateExperimentSchema = z.object({
  name: z.string().min(1).max(80),
  durationMs: z.number().int().min(1_000).max(10 * 60_000),
  blastPct: z.number().min(0).max(100),
  fault: FaultSchema,
  hypothesis: HypothesisSchema,
  notes: z.string().max(2_000).optional(),
});

export type Experiment = z.infer<typeof CreateExperimentSchema> & {
  id: string;
  status: "created" | "running" | "stopped" | "completed";
  createdAt: string;
  startedAt?: string;
  stoppedAt?: string;
};

type Persisted = {
  activeId: string | null;
  experiments: Experiment[];
};

type StoreState = {
  initialized: boolean;
  activeId: string | null;
  experiments: Map<string, Experiment>;
  writeChain: Promise<void>;
};

function getDataDir() {
  return path.join(process.cwd(), ".data");
}

function getPersistPath() {
  return path.join(getDataDir(), "experiments.json");
}

function ensureDirSync(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function safeReadJson(p: string): Persisted | null {
  try {
    const raw = fs.readFileSync(p, "utf-8");
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

function createState(): StoreState {
  return {
    initialized: false,
    activeId: null,
    experiments: new Map(),
    writeChain: Promise.resolve(),
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __chaosLabStore: StoreState | undefined;
}

function getState(): StoreState {
  if (!globalThis.__chaosLabStore) globalThis.__chaosLabStore = createState();
  return globalThis.__chaosLabStore;
}

async function persist(state: StoreState) {
  const dir = getDataDir();
  ensureDirSync(dir);
  const payload: Persisted = {
    activeId: state.activeId,
    experiments: Array.from(state.experiments.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
  fs.writeFileSync(getPersistPath(), JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

export async function initStore() {
  const state = getState();
  if (state.initialized) return;

  const persisted = safeReadJson(getPersistPath());
  if (persisted) {
    state.activeId = persisted.activeId ?? null;
    for (const exp of persisted.experiments ?? []) state.experiments.set(exp.id, exp);
  }
  state.initialized = true;
}

export async function listExperiments(): Promise<Experiment[]> {
  await initStore();
  return Array.from(getState().experiments.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getExperiment(id: string): Promise<Experiment | null> {
  await initStore();
  return getState().experiments.get(id) ?? null;
}

export async function getActiveExperiment(): Promise<Experiment | null> {
  await initStore();
  const state = getState();
  if (!state.activeId) return null;
  return state.experiments.get(state.activeId) ?? null;
}

export async function createExperiment(input: unknown): Promise<Experiment> {
  await initStore();
  const parsed = CreateExperimentSchema.parse(input);
  const now = new Date().toISOString();

  const exp: Experiment = {
    ...parsed,
    id: crypto.randomUUID(),
    status: "created",
    createdAt: now,
  };

  const state = getState();
  state.experiments.set(exp.id, exp);
  state.writeChain = state.writeChain.then(() => persist(state));
  await state.writeChain;
  return exp;
}

export async function startExperiment(id: string): Promise<Experiment> {
  await initStore();
  const state = getState();
  const exp = state.experiments.get(id);
  if (!exp) throw new Error("Experiment not found");
  if (state.activeId && state.activeId !== id) throw new Error("Another experiment is already running");
  if (exp.status === "running") return exp;

  const updated: Experiment = { ...exp, status: "running", startedAt: new Date().toISOString() };
  state.experiments.set(id, updated);
  state.activeId = id;
  state.writeChain = state.writeChain.then(() => persist(state));
  await state.writeChain;
  return updated;
}

export async function stopExperiment(id: string): Promise<Experiment> {
  await initStore();
  const state = getState();
  const exp = state.experiments.get(id);
  if (!exp) throw new Error("Experiment not found");

  const nextStatus: Experiment["status"] = exp.status === "running" ? "completed" : "stopped";
  const updated: Experiment = { ...exp, status: nextStatus, stoppedAt: new Date().toISOString() };
  state.experiments.set(id, updated);
  if (state.activeId === id) state.activeId = null;

  state.writeChain = state.writeChain.then(() => persist(state));
  await state.writeChain;
  return updated;
}

