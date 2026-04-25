const { FLAGS, enable, disable, has } = require("./flags");

let mask = 0;
mask = enable(mask, FLAGS.READ);
mask = enable(mask, FLAGS.WRITE);
mask = enable(mask, FLAGS.EXPORT);
mask = disable(mask, FLAGS.WRITE);

console.log("Mask:", mask.toString(2).padStart(4, "0"));
console.log("Can export?", has(mask, FLAGS.EXPORT));
console.log("Can write?", has(mask, FLAGS.WRITE));
