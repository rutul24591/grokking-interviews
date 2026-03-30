const api = { posts: [{ id: 'p1', title: 'Launch', author: { id: 'u1', name: 'Tia' } }] };
const normalized = { users: { u1: api.posts[0].author }, posts: { p1: { id: 'p1', title: 'Launch', authorId: 'u1' } }, postIds: ['p1'] };
const denormalized = normalized.postIds.map((id) => ({ ...normalized.posts[id], author: normalized.users[normalized.posts[id].authorId] }));
console.log({ normalized, denormalized });
