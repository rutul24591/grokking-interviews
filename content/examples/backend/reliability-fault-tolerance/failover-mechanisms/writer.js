const axios = require('axios');

async function writeOrder(order) {
  const primary = process.env.PRIMARY_HOST;
  await axios.post('http://' + primary + ':8080/write', order);
}

module.exports = { writeOrder };