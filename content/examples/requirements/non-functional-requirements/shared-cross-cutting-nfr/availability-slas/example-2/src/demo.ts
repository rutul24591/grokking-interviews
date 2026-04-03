type Topology = { name: string; serial: number[]; parallel: number[] };

function effectiveAvailability(topology: Topology) {
  const serial = topology.serial.reduce((acc, value) => acc * value, 1);
  const parallelDown = topology.parallel.reduce((acc, value) => acc * (1 - value), 1);
  return {
    name: topology.name,
    serial,
    parallel: 1 - parallelDown,
    decision: serial >= 0.999 ? 'meets-sla' : 'needs-redundancy',
  };
}

const results = [
  { name: 'api+db', serial: [0.999, 0.9995], parallel: [0.999, 0.9995] },
  { name: 'api+cache+db', serial: [0.999, 0.995, 0.999], parallel: [0.999, 0.995] },
].map(effectiveAvailability);

console.table(results);
if (results[1].decision !== 'needs-redundancy') throw new Error('Three-tier serial path should miss 99.9 SLA');
