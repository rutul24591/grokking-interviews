// Read from projection
const orders = await readDb.order_view.find({ userId: '1' });
