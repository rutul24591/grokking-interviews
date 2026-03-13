const data = [{ city: 'NY', sales: 10 }, { city: 'NY', sales: 5 }];
const grouped = {};
for (const row of data) {
  grouped[row.city] = (grouped[row.city] || 0) + row.sales;
}
console.log(grouped);