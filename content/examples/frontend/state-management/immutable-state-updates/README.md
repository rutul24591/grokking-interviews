# Immutable State Updates Examples

## Example 1: Spread Operator Patterns

```javascript
// Shallow update
const newState = { ...state, name: 'New Name' };

// Nested update (verbose but explicit)
const newState = {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'New York',
    },
  },
};

// Array updates
const added = [...state.items, newItem];
const removed = state.items.filter(item => item.id !== targetId);
const updated = state.items.map(item =>
  item.id === targetId ? { ...item, completed: true } : item
);

// Array insertion at index
const inserted = [
  ...state.items.slice(0, index),
  newItem,
  ...state.items.slice(index),
];
```

## Example 2: Immer with React

```javascript
import { produce } from 'immer';
import { useImmerReducer } from 'use-immer';

function todoReducer(draft, action) {
  switch (action.type) {
    case 'ADD':
      draft.todos.push({ id: Date.now(), text: action.text, done: false });
      break;
    case 'TOGGLE':
      const todo = draft.todos.find(t => t.id === action.id);
      if (todo) todo.done = !todo.done;
      break;
    case 'DELETE':
      const index = draft.todos.findIndex(t => t.id === action.id);
      if (index !== -1) draft.todos.splice(index, 1);
      break;
    case 'REORDER': {
      const [moved] = draft.todos.splice(action.from, 1);
      draft.todos.splice(action.to, 0, moved);
      break;
    }
  }
}

function TodoApp() {
  const [state, dispatch] = useImmerReducer(todoReducer, { todos: [] });
  // Immer handles immutability - you write "mutations" that produce immutable updates
}
```

## Example 3: Redux Toolkit (Built-in Immer)

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: {}, totalItems: 0 },
  reducers: {
    // These look like mutations but Immer makes them immutable
    addItem(state, action) {
      const { id, price } = action.payload;
      if (state.items[id]) {
        state.items[id].quantity += 1;
      } else {
        state.items[id] = { ...action.payload, quantity: 1 };
      }
      state.totalItems += 1;
    },
    removeItem(state, action) {
      const id = action.payload;
      if (state.items[id]) {
        state.totalItems -= state.items[id].quantity;
        delete state.items[id];
      }
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items[id];
      if (item) {
        state.totalItems += quantity - item.quantity;
        item.quantity = quantity;
      }
    },
  },
});
```

## Example 4: Structural Sharing Demonstration

```javascript
const original = {
  user: { name: 'Alice', settings: { theme: 'dark' } },
  posts: [{ id: 1, title: 'Hello' }, { id: 2, title: 'World' }],
};

// Only user.name changes
const updated = {
  ...original,          // New root reference
  user: {
    ...original.user,   // New user reference
    name: 'Bob',        // Changed value
    // original.user.settings is SHARED (same reference)
  },
  // original.posts is SHARED (same reference)
};

console.log(updated === original);                      // false (new root)
console.log(updated.user === original.user);            // false (new user)
console.log(updated.user.settings === original.user.settings); // true (shared!)
console.log(updated.posts === original.posts);          // true (shared!)

// React can efficiently check: updated.posts === original.posts
// Since true, skip re-rendering PostList component
```
