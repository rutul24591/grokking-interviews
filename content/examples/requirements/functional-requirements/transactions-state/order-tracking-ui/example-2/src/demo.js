function chooseTrackingPresentation(shipments) {
  return shipments.map((shipment) => ({
    id: shipment.id,
    showMap: shipment.milestone === "out-for-delivery",
    showExceptionBanner: shipment.exception !== "none",
    showFinalCTA: shipment.milestone === "delivered"
  }));
}

console.log(chooseTrackingPresentation([
  { id: "trk-1", milestone: "out-for-delivery", exception: "none" },
  { id: "trk-2", milestone: "in-transit", exception: "carrier-delay" }
]));
