function logSlowQuery(sql, ms) {
  if (ms > 200) console.log('slow', sql, ms);
}
module.exports = { logSlowQuery };