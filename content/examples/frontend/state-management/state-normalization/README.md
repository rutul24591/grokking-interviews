# State Normalization Examples

## Example 1: Manual Normalization

```javascript
// API returns nested data
const apiResponse = {
  posts: [
    {
      id: 'p1',
      title: 'Hello',
      author: { id: 'u1', name: 'Alice' },
      comments: [
        { id: 'c1', text: 'Great!', author: { id: 'u2', name: 'Bob' } },
        { id: 'c2', text: 'Thanks', author: { id: 'u1', name: 'Alice' } },
      ],
    },
  ],
};

// Normalize into flat entities
function normalize(response) {
  const entities = { users: {}, posts: {}, comments: {} };
  const result = [];

  for (const post of response.posts) {
    entities.users[post.author.id] = post.author;

    const commentIds = post.comments.map(c => {
      entities.comments[c.id] = { id: c.id, text: c.text, authorId: c.author.id };
      entities.users[c.author.id] = c.author;
      return c.id;
    });

    entities.posts[post.id] = {
      id: post.id,
      title: post.title,
      authorId: post.author.id,
      commentIds,
    };
    result.push(post.id);
  }

  return { entities, result };
}

// Result:
// entities.users: { u1: { id: 'u1', name: 'Alice' }, u2: { ... } }
// entities.posts: { p1: { id: 'p1', title: 'Hello', authorId: 'u1', commentIds: ['c1', 'c2'] } }
// entities.comments: { c1: { id: 'c1', text: 'Great!', authorId: 'u2' }, ... }
```

## Example 2: Redux Toolkit createEntityAdapter

```javascript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({ loading: false }),
  reducers: {
    addUser: usersAdapter.addOne,
    updateUser: usersAdapter.updateOne,
    removeUser: usersAdapter.removeOne,
    setUsers: usersAdapter.setAll,
    upsertUsers: usersAdapter.upsertMany,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      usersAdapter.setAll(state, action.payload);
      state.loading = false;
    });
  },
});

// Auto-generated selectors
const usersSelectors = usersAdapter.getSelectors((state) => state.users);
// usersSelectors.selectAll(state)  → User[]
// usersSelectors.selectById(state, id) → User | undefined
// usersSelectors.selectIds(state) → string[]
// usersSelectors.selectTotal(state) → number
```

## Example 3: normalizr Library

```javascript
import { normalize, schema } from 'normalizr';

// Define schemas
const userSchema = new schema.Entity('users');
const commentSchema = new schema.Entity('comments', {
  author: userSchema,
});
const postSchema = new schema.Entity('posts', {
  author: userSchema,
  comments: [commentSchema],
});

// Normalize API response
const normalized = normalize(apiResponse, { posts: [postSchema] });

// Result shape:
// {
//   entities: {
//     users: { u1: {...}, u2: {...} },
//     posts: { p1: {...} },
//     comments: { c1: {...}, c2: {...} },
//   },
//   result: { posts: ['p1'] }
// }
```

## Example 4: Denormalization Selector

```javascript
import { createSelector } from '@reduxjs/toolkit';

// Denormalize for UI consumption
const selectPostWithDetails = createSelector(
  [
    (state) => state.entities.posts,
    (state) => state.entities.users,
    (state) => state.entities.comments,
    (_, postId) => postId,
  ],
  (posts, users, comments, postId) => {
    const post = posts[postId];
    if (!post) return null;

    return {
      ...post,
      author: users[post.authorId],
      comments: post.commentIds.map(cid => ({
        ...comments[cid],
        author: users[comments[cid].authorId],
      })),
    };
  }
);

// Usage
function PostDetail({ postId }) {
  const post = useSelector(state => selectPostWithDetails(state, postId));
  return <Post data={post} />;
}
```
