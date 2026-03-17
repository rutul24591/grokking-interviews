// Redis lock with token
const token = String(Date.now());
await redis.set('lock:report', token, 'NX', 'PX', 5000);

const script = 'if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end';
await redis.eval(script, 1, 'lock:report', token);
