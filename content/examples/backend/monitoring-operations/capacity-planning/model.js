const cfg = require('./capacity.json');
const needed = Math.ceil(cfg.rps / cfg.instanceCapacityRps);
const withHeadroom = Math.ceil(needed * (1 + cfg.headroomPercent / 100));
console.log({ needed, withHeadroom });