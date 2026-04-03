type Client = { name: string; currentVersion: number; sunsetInDays: number; critical: boolean };

function chooseMigrationPlan(client: Client) {
  const urgent = client.currentVersion === 1 && client.sunsetInDays <= 30;
  return {
    client: client.name,
    urgent,
    action: urgent ? 'schedule-forced-upgrade' : client.critical ? 'maintain-compatibility-shim' : 'migrate-in-next-sprint',
  };
}

const results = [
  { name: 'ios-legacy', currentVersion: 1, sunsetInDays: 14, critical: true },
  { name: 'partner-reporting', currentVersion: 1, sunsetInDays: 90, critical: false },
].map(chooseMigrationPlan);

console.table(results);
if (results[0].action !== 'schedule-forced-upgrade') throw new Error('Legacy iOS client should be urgent');
