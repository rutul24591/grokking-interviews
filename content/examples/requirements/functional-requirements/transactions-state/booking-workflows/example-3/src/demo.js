function detectBookingWorkflowEdgeCases(bookings) {
  const doubleBooked = bookings.filter((booking) => booking.sameResourceReservations > 1).map((booking) => booking.id);
  const partialConfirmation = bookings.filter((booking) => booking.paymentCaptured && !booking.inventoryCommitted).map((booking) => booking.id);
  return {
    doubleBooked,
    partialConfirmation,
    freezeInventoryWrites: doubleBooked.length > 0,
    triggerCompensation: partialConfirmation.length > 0
  };
}

console.log(detectBookingWorkflowEdgeCases([
  { id: "bk-1", sameResourceReservations: 2, paymentCaptured: false, inventoryCommitted: false },
  { id: "bk-2", sameResourceReservations: 1, paymentCaptured: true, inventoryCommitted: false }
]));
