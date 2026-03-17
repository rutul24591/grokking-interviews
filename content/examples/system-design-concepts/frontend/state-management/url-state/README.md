# URL State & Query Parameters Examples

## Example 1: useSearchParams with React Router

```javascript
import { useSearchParams } from 'react-router-dom';

function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      // Reset page when filters change
      if (key !== 'page') next.set('page', '1');
      return next;
    });
  };

  return (
    <div>
      <CategorySelect value={category} onChange={v => updateFilter('category', v)} />
      <SortSelect value={sort} onChange={v => updateFilter('sort', v)} />
      <Pagination page={page} onChange={v => updateFilter('page', String(v))} />
    </div>
  );
}
```

## Example 2: Next.js useSearchParams

```javascript
'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

function useQueryState(key, defaultValue = '') {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback((newValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === null || newValue === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, newValue);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [key, defaultValue, searchParams, router, pathname]);

  return [value, setValue];
}

// Usage
function SearchPage() {
  const [query, setQuery] = useQueryState('q');
  const [category, setCategory] = useQueryState('cat', 'all');

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
      </select>
    </div>
  );
}
```

## Example 3: Debounced URL Updates

```javascript
import { useDeferredValue, useState, useEffect } from 'react';

function SearchWithDebounce() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const deferredValue = useDeferredValue(inputValue);

  // Sync deferred value to URL
  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (deferredValue) {
        next.set('q', deferredValue);
      } else {
        next.delete('q');
      }
      return next;
    }, { replace: true }); // replace to avoid polluting history
  }, [deferredValue, setSearchParams]);

  return <input value={inputValue} onChange={e => setInputValue(e.target.value)} />;
}
```

## Example 4: Complex State Serialization

```javascript
// Serialize complex filter state to URL-safe string
function serializeFilters(filters) {
  return btoa(JSON.stringify(filters));
}

function deserializeFilters(encoded) {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

// Usage: /search?filters=eyJjYXRlZ29yeSI6ImVsZWN0cm9uaWNzIn0=
function AdvancedSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = deserializeFilters(searchParams.get('filters')) || DEFAULT_FILTERS;

  const updateFilters = (newFilters) => {
    setSearchParams({ filters: serializeFilters(newFilters) });
  };

  return <FilterPanel filters={filters} onChange={updateFilters} />;
}
```
