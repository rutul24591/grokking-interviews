type Event = { seq: number; type: string };

function inspectStream(events: Event[]) {
  const issues: string[] = [];
  for (let index = 1; index < events.length; index += 1) {
    const delta = events[index].seq - events[index - 1].seq;
    if (delta === 0) issues.push(`duplicate:${events[index].seq}`);
    if (delta > 1) issues.push(`gap:${events[index - 1].seq}->${events[index].seq}`);
    if (delta < 0) issues.push(`reorder:${events[index].seq}`);
  }
  return issues;
}

const issues = inspectStream([{ seq: 10, type: 'created' }, { seq: 11, type: 'paid' }, { seq: 11, type: 'paid' }, { seq: 14, type: 'shipped' }]);
console.log(JSON.stringify({ issues }, null, 2));
if (issues.length !== 2) throw new Error('Expected duplicate and gap to be detected');
