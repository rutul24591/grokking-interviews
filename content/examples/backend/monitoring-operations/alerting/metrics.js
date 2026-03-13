let errors = 0;
function error() { errors += 1; }
function rate() { return errors / 1000; }
module.exports = { error, rate };