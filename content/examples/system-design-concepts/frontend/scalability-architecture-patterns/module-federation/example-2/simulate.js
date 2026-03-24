function pickShared({ name, host, remote, singleton }) {
  // Minimal semver-ish compare: higher major wins, then minor, then patch.
  const parse = (v) => v.split(".").map((n) => Number(n));
  const cmp = (a, b) => {
    const pa = parse(a);
    const pb = parse(b);
    for (let i = 0; i < 3; i += 1) {
      if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
    }
    return 0;
  };

  if (!singleton) return { name, chosen: "both", host, remote, reason: "not a singleton" };

  const chosen = cmp(host, remote) >= 0 ? host : remote;
  return { name, chosen, host, remote, reason: "singleton -> pick one version" };
}

const shared = [
  { name: "react", host: "19.2.3", remote: "19.2.3", singleton: true },
  { name: "react-dom", host: "19.2.3", remote: "19.2.3", singleton: true },
  { name: "lodash", host: "4.17.21", remote: "4.17.15", singleton: false }
];

for (const dep of shared) process.stdout.write(`${JSON.stringify(pickShared(dep))}\n`);

