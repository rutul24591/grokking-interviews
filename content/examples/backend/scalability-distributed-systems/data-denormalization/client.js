// Read from denormalized view
const rows = await db.user_search.find({ name: 'Asha' });
