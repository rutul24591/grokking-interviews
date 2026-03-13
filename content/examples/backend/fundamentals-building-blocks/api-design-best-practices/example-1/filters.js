// Filter and sort helpers for orders.

function filterOrders(orders, query) {
  let result = orders.slice();

  if (query.status) {
    result = result.filter((order) => order.status === query.status);
  }

  if (query.minTotal !== undefined) {
    result = result.filter((order) => order.total >= query.minTotal);
  }

  if (query.maxTotal !== undefined) {
    result = result.filter((order) => order.total <= query.maxTotal);
  }

  if (query.sort) {
    const [field, direction] = query.sort.split(":");
    const dir = direction === "desc" ? -1 : 1;
    result = result.sort((a, b) => (a[field] > b[field] ? dir : -dir));
  }

  return result;
}

module.exports = { filterOrders };
