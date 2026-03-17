let tokens = 5;
function allow() {
  if (tokens <= 0) return false;
  tokens -= 1;
  return true;
}
module.exports = { allow };