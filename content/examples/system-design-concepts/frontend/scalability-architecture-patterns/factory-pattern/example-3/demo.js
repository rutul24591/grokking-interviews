import { z } from "zod";

const pluginSchema = z.object({
  key: z.string().min(1),
  version: z.number().int(),
  run: z.function().args(z.any()).returns(z.any())
});

function createRegistry() {
  const map = new Map();
  return {
    register: (plugin) => {
      const p = pluginSchema.parse(plugin);
      map.set(p.key, p);
    },
    run: (key, input) => {
      const plugin = map.get(key);
      if (!plugin) return { ok: false, error: `missing plugin: ${key}` };
      return { ok: true, output: plugin.run(input), version: plugin.version };
    }
  };
}

const reg = createRegistry();
reg.register({ key: "uppercase", version: 1, run: (s) => String(s).toUpperCase() });

process.stdout.write(`${JSON.stringify(reg.run("uppercase", "hello"))}\n`);
process.stdout.write(`${JSON.stringify(reg.run("missing", "hello"))}\n`);

