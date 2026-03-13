const fs = require('fs');

function aggregate(orders) {
  const byDay = {};
  for (const o of orders) {
    const day = o.date;
    byDay[day] = (byDay[day] || 0) + o.total;
  }
  return byDay;
}

const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
const summary = aggregate(orders);
fs.writeFileSync('daily.json', JSON.stringify(summary));