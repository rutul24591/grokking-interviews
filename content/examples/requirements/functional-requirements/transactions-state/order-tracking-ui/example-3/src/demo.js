function detectTrackingEdgeCases(shipments) {
  const staleCarrierEvents = shipments.filter((shipment) => shipment.eventAgeMinutes > shipment.maxEventAgeMinutes).map((shipment) => shipment.id);
  const missingProof = shipments.filter((shipment) => shipment.milestone === "delivered" && !shipment.deliveryProof).map((shipment) => shipment.id);
  return {
    staleCarrierEvents,
    missingProof,
    triggerCarrierRefresh: staleCarrierEvents.length > 0,
    showSupportCTA: missingProof.length > 0
  };
}

console.log(detectTrackingEdgeCases([
  { id: "trk-1", eventAgeMinutes: 80, maxEventAgeMinutes: 30, milestone: "in-transit", deliveryProof: false },
  { id: "trk-2", eventAgeMinutes: 10, maxEventAgeMinutes: 30, milestone: "delivered", deliveryProof: false }
]));
