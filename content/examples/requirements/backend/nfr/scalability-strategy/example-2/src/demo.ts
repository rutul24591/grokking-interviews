function recommendInstances(params: { rps: number; perInstanceRps: number; targetUtil: number; headroom: number }) {
  const effectivePerInstance = params.perInstanceRps * params.targetUtil;
  const raw = params.rps / effectivePerInstance;
  return Math.ceil(raw * (1 + params.headroom));
}

console.log(
  JSON.stringify(
    {
      instances: recommendInstances({ rps: 20_000, perInstanceRps: 1500, targetUtil: 0.6, headroom: 0.2 })
    },
    null,
    2
  )
);

