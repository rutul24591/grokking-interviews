type Dependency = { name: string; outdatedMajor: boolean; criticalCvss: number; ownerAssigned: boolean };

function triageDependency(dep: Dependency) {
  const urgent = dep.criticalCvss >= 9 || (dep.outdatedMajor && !dep.ownerAssigned);
  return {
    dependency: dep.name,
    urgent,
    action: urgent ? 'open-upgrade-incident' : 'schedule-normal-upgrade',
  };
}

const results = [
  { name: 'next', outdatedMajor: false, criticalCvss: 4.3, ownerAssigned: true },
  { name: 'image-lib', outdatedMajor: true, criticalCvss: 9.8, ownerAssigned: false },
].map(triageDependency);

console.table(results);
if (results[1].action !== 'open-upgrade-incident') throw new Error('Critical vulnerable dependency should be urgent');
