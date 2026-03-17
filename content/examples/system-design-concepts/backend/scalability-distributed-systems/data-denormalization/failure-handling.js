// Queue repair if view update fails
await queue.add('rebuild_user_search', { userId });
