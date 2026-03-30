const initial = { cart: [], theme: 'dark' };
function reduce(state, action) {
  switch (action.type) {
    case 'add-item':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'toggle-theme':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    default:
      return state;
  }
}
let state = initial;
for (const action of [{ type: 'add-item', payload: 'graphql-cheatsheet' }, { type: 'toggle-theme' }]) {
  state = reduce(state, action);
  console.log({ action, state });
}
