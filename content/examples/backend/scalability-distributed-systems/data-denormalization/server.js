// Update base table and view
await db.users.update(userId, { name: 'Asha' });
await db.user_search.update(userId, { name: 'Asha' });
