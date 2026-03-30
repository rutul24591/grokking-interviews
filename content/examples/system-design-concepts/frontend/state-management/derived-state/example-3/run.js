const state = {
  incidents: [
    { id: 'i1', severity: 'critical' },
    { id: 'i2', severity: 'warning' }
  ],
  cachedCriticalCount: 1
};

state.incidents.push({ id: 'i3', severity: 'critical' });
const actual = state.incidents.filter((incident) => incident.severity === 'critical').length;
console.log({ cached: state.cachedCriticalCount, actual, driftDetected: state.cachedCriticalCount !== actual });
