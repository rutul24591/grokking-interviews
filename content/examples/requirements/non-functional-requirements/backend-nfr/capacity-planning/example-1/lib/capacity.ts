export type Input = {
  rps: number;
  p95LatencyMs: number;
  cpuMsPerReq: number;
  coresPerInstance: number;
  targetUtilization: number; // 0..1
  headroomPct: number; // 0..100
};

export function plan(i: Input) {
  const latencySec = i.p95LatencyMs / 1000;
  const concurrency = i.rps * latencySec; // Little's law approx (L = λW)

  const cpuSecPerSec = (i.rps * i.cpuMsPerReq) / 1000;
  const requiredCoresAtUtil = cpuSecPerSec / i.targetUtilization;
  const headroomFactor = 1 + i.headroomPct / 100;
  const requiredCores = requiredCoresAtUtil * headroomFactor;
  const instances = Math.ceil(requiredCores / i.coresPerInstance);

  return {
    concurrency: Math.ceil(concurrency),
    cpuSecPerSec,
    requiredCoresAtUtil,
    requiredCores,
    instances
  };
}

