let tokens = 100;
setInterval(() => { tokens = Math.min(100, tokens + 10); }, 1000);

function allow() {
  if (tokens <= 0) return false;
  tokens -= 1;
  return true;
}

module.exports = { allow };