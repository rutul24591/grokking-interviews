async function runSaga() {
  try {
    await reserveInventory();
    await chargePayment();
  } catch {
    await releaseInventory();
  }
}
module.exports = { runSaga };