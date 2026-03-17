# Derived State Examples

## Example 1: useMemo for Computed Values

```javascript
import { useMemo } from 'react';

function ProductList({ products, filters, sortOrder }) {
  // Derived: filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.inStock && !p.inStock) return false;
      return true;
    });
  }, [products, filters]);

  // Derived: sorted filtered products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [filteredProducts, sortOrder]);

  // Derived: summary stats
  const stats = useMemo(() => ({
    total: filteredProducts.length,
    avgPrice: filteredProducts.reduce((s, p) => s + p.price, 0) / filteredProducts.length,
    categories: [...new Set(filteredProducts.map(p => p.category))],
  }), [filteredProducts]);

  return (
    <div>
      <Stats {...stats} />
      {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

## Example 2: Reselect Selectors (Redux)

```javascript
import { createSelector } from '@reduxjs/toolkit';

// Input selectors
const selectProducts = (state) => state.products.items;
const selectFilter = (state) => state.products.filter;
const selectSort = (state) => state.products.sortOrder;

// Memoized derived selector
const selectFilteredProducts = createSelector(
  [selectProducts, selectFilter],
  (products, filter) => {
    return products.filter(p => {
      if (filter.category && p.category !== filter.category) return false;
      if (filter.search && !p.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  }
);

// Composed selector (uses output of another selector)
const selectSortedFilteredProducts = createSelector(
  [selectFilteredProducts, selectSort],
  (filtered, sort) => [...filtered].sort(comparators[sort])
);

// Usage in component - only re-renders when derived result changes
function ProductGrid() {
  const products = useSelector(selectSortedFilteredProducts);
  return <Grid items={products} />;
}
```

## Example 3: Zustand Derived State with Selectors

```javascript
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) => set(state => ({ items: [...state.items, item] })),
  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id),
  })),
}));

// Derived selectors (computed outside store)
const selectItemCount = (state) => state.items.length;
const selectTotal = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const selectHasItem = (id) => (state) =>
  state.items.some(item => item.id === id);

// Usage
function CartSummary() {
  const count = useCartStore(selectItemCount);
  const total = useCartStore(selectTotal);
  return <div>{count} items - ${total.toFixed(2)}</div>;
}
```

## Example 4: Anti-Pattern - Storing Derived State

```javascript
// BAD: Redundant state that can get out of sync
function BadExample() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // Don't do this!
  const [itemCount, setItemCount] = useState(0);           // Don't do this!

  useEffect(() => {
    setFilteredItems(items.filter(i => i.active));
    setItemCount(items.length);
  }, [items]);
  // Problems: extra re-renders, potential race conditions, triple state updates
}

// GOOD: Derive during render
function GoodExample() {
  const [items, setItems] = useState([]);
  const filteredItems = items.filter(i => i.active);  // Computed
  const itemCount = items.length;                       // Computed
  // Single source of truth, no sync issues
}
```
