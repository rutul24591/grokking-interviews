// Fencing token pattern
const token = await coordinationService.nextToken('db-primary');
await db.write('UPDATE accounts SET ...', { fencingToken: token });
