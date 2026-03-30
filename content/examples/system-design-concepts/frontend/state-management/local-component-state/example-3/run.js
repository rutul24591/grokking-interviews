const transitions = {
  idle: { OPEN: 'editing' },
  editing: { SUBMIT: 'saving', CANCEL: 'idle' },
  saving: { SUCCESS: 'done', FAILURE: 'editing' },
  done: { RESET: 'idle' }
};

function step(state, event) {
  return transitions[state][event] ?? state;
}

let state = 'idle';
for (const event of ['OPEN', 'SUBMIT', 'FAILURE', 'SUBMIT', 'SUCCESS', 'RESET']) {
  state = step(state, event);
  console.log({ event, state });
}
