const { onEvent } = require('./processor');

function consume(events) {
  for (const e of events) onEvent(e);
}

consume([{ id: 1 }, { id: 2 }]);