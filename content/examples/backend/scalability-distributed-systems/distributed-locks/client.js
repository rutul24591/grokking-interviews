// Acquire lock before critical section
const locked = await redis.set('lock:job', token, 'NX', 'PX', 5000);
