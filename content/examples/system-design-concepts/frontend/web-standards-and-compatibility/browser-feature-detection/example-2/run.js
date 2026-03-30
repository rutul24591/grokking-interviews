const envs = [
  { name: 'modern', features: { sw: true, bc: true } },
  { name: 'limited', features: { sw: false, bc: true } }
];
console.log(envs.map((env) => ({ name: env.name, upgrade: env.features.sw ? 'offline-enabled' : 'network-only' })));
