let count = 0;
function onEvent(evt) {
  count += 1;
  if (count % 100 === 0) console.log('count', count);
}
module.exports = { onEvent };