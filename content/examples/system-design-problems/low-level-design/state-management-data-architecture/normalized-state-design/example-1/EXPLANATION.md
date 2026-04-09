# Normalized State — Basic Implementation

## Architecture

```
┌─────────────────────────────────────────────────┐
│              API Response (Nested)               │
│  Post { author: User, comments: [Comment{}] }   │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │     Normalizer         │
        │  Extract entities      │
        │  Replace with IDs      │
        └────────┬───────────────┘
                 │
      ┌──────────┼──────────────┐
      ▼          ▼              ▼
┌──────────┐ ┌─────────┐ ┌──────────┐
│  Users   │ │  Posts  │ │ Comments │
│  Table   │ │  Table  │ │  Table   │
│ {id:User}│ │{id:Post}│ │{id:Comm} │
└──────────┘ └─────────┘ └──────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │    Denormalizer        │
        │  Follow ID references  │
        │  Reconstruct nested    │
        └────────────────────────┘
```

## Key Design Decisions

1. **Entity Tables (ID Dictionaries)** - Each entity type stored as Record<ID, Entity> for O(1) lookups
2. **Foreign Key References** - Relationships expressed via IDs (post.authorId, post.commentIds) not nested objects
3. **Shallow Merge on Updates** - Partial entities merge with existing, unchanged fields keep references
4. **Memoized Denormalization** - Selectors follow IDs and memoize results, recalculate only when inputs change

## File Structure

- `lib/entity-adapter.ts` — Generic CRUD for entity tables (addOne, updateOne, removeOne)
- `lib/normalizer.ts` — Flattens nested API responses into entity tables
- `hooks/useNormalizedQuery.ts` — Memoized denormalization hook
- `components/post-view.tsx` — Component showing denormalized post with comments

## Testing Strategy

- Unit: normalizer flattens correctly, adapter CRUD operations, denormalizer reconstructs
- Integration: API response → normalize → store → denormalize → component
- Performance: update one entity, verify only affected components re-render
