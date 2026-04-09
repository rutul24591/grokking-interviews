'use client';
import { createStore, Store } from '../lib/store-core';
import { useMyStore } from '../hooks/useMyStore';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

// Create store
const todoStore = createStore<TodoState>({
  todos: [],
  filter: 'all',
});

/**
 * TodoList demonstrates multiple components subscribing to the same store
 * with different selectors — each re-renders independently.
 */
export function TodoList() {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Custom Store Todo List</h3>
      <div className="space-y-4">
        <TodoInput />
        <FilterControls />
        <TodoItems />
        <TodoStats />
      </div>
    </div>
  );
}

/**
 * TodoInput subscribes to nothing — it only dispatches actions.
 */
function TodoInput() {
  const handleAdd = (text: string) => {
    const currentTodos = todoStore.getState().todos;
    todoStore.setState({
      todos: [
        ...currentTodos,
        {
          id: `todo_${Date.now()}`,
          text,
          completed: false,
        },
      ],
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = (e.target as HTMLFormElement).elements.namedItem('todo-text') as HTMLInputElement;
        if (input.value.trim()) {
          handleAdd(input.value.trim());
          input.value = '';
        }
      }}
      className="flex gap-2"
    >
      <input
        name="todo-text"
        type="text"
        placeholder="Add a todo..."
        className="flex-1 px-3 py-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}

/**
 * FilterControls subscribes only to filter slice.
 * Does NOT re-render when todos change.
 */
function FilterControls() {
  const filter = useMyStore(todoStore, (state) => state.filter);

  return (
    <div className="flex gap-2">
      {(['all', 'active', 'completed'] as const).map((f) => (
        <button
          key={f}
          onClick={() => todoStore.setState({ filter: f })}
          className={`px-3 py-1 rounded ${
            filter === f
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

/**
 * TodoItems subscribes to filtered todos.
 * Re-renders when todos or filter changes.
 */
function TodoItems() {
  const filteredTodos = useMyStore(todoStore, (state) => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter((t) => !t.completed);
      case 'completed':
        return state.todos.filter((t) => t.completed);
      default:
        return state.todos;
    }
  });

  return (
    <ul className="space-y-2">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

/**
 * TodoItem uses store action directly — no subscription needed.
 */
function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className="flex items-center gap-2 p-2 border rounded">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => {
          const todos = todoStore.getState().todos;
          todoStore.setState({
            todos: todos.map((t) =>
              t.id === todo.id ? { ...t, completed: !t.completed } : t
            ),
          });
        }}
      />
      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
        {todo.text}
      </span>
      <button
        onClick={() => {
          const todos = todoStore.getState().todos;
          todoStore.setState({
            todos: todos.filter((t) => t.id !== todo.id),
          });
        }}
        className="ml-auto text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </li>
  );
}

/**
 * TodoStats subscribes to a derived selector (counts).
 * Re-renders when any todo changes or filter changes.
 */
function TodoStats() {
  const stats = useMyStore(todoStore, (state) => ({
    total: state.todos.length,
    active: state.todos.filter((t) => !t.completed).length,
    completed: state.todos.filter((t) => t.completed).length,
  }));

  return (
    <div className="text-sm text-gray-600 flex gap-4">
      <span>Total: {stats.total}</span>
      <span>Active: {stats.active}</span>
      <span>Completed: {stats.completed}</span>
    </div>
  );
}
