function consume(events) {
  for (const e of events) console.log('got', e.id);
}

consume([{ id: 'o1' }]);