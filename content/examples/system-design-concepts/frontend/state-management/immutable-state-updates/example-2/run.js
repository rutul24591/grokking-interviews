const state = { board: { lanes: [{ id: 'todo', cards: [{ id: 'c1', done: false }] }] } };

const manual = {
  ...state,
  board: {
    ...state.board,
    lanes: state.board.lanes.map((lane) => lane.id === 'todo' ? { ...lane, cards: lane.cards.map((card) => card.id === 'c1' ? { ...card, done: true } : card) } : lane)
  }
};

const helper = structuredClone(state);
helper.board.lanes[0].cards[0].done = true;
console.log({ original: state.board.lanes[0].cards[0].done, manual: manual.board.lanes[0].cards[0].done, helper: helper.board.lanes[0].cards[0].done });
