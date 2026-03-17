# Local Component State Examples

## Example 1: useState with Functional Updates

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // Functional update avoids stale closure issues
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const incrementBy = (n) => setCount(prev => prev + n);

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

## Example 2: useState with Lazy Initialization

```javascript
function ExpensiveComponent() {
  // Lazy initializer only runs on first render
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('form-draft');
    return saved ? JSON.parse(saved) : { name: '', email: '' };
  });

  return <Form data={data} onChange={setData} />;
}
```

## Example 3: useReducer for Complex State

```javascript
import { useReducer } from 'react';

const initialState = {
  items: [],
  filter: 'all',
  sortBy: 'date',
  isLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    default:
      return state;
  }
}

function ItemManager() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });

  return <ItemList state={state} onAdd={addItem} onRemove={removeItem} />;
}
```

## Example 4: Lifting State Up

```javascript
function Parent() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div>
      <Sidebar items={items} selectedId={selectedId} onSelect={setSelectedId} />
      <Detail itemId={selectedId} />
    </div>
  );
}

function Sidebar({ items, selectedId, onSelect }) {
  return (
    <ul>
      {items.map(item => (
        <li
          key={item.id}
          className={item.id === selectedId ? 'active' : ''}
          onClick={() => onSelect(item.id)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```
