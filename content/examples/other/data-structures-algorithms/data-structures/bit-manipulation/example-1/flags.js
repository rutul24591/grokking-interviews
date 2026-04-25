const FLAGS = {
  READ: 1 << 0,
  WRITE: 1 << 1,
  DELETE: 1 << 2,
  EXPORT: 1 << 3,
};

function enable(mask, flag) {
  return mask | flag;
}

function disable(mask, flag) {
  return mask & ~flag;
}

function has(mask, flag) {
  return (mask & flag) === flag;
}

module.exports = { FLAGS, enable, disable, has };
