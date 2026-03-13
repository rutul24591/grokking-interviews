function capture(change) {
  console.log('emit', change.id);
}
module.exports = { capture };