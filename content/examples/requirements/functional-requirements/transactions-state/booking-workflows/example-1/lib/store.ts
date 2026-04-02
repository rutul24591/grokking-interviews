type ReservationState = "available" | "held" | "confirmed" | "cancelled";

const state = {
  reservations: [
    { id: "bk-1", resource: "Studio slot 10:00", status: "available" as ReservationState, holdExpiresIn: 0 },
    { id: "bk-2", resource: "Studio slot 11:00", status: "held" as ReservationState, holdExpiresIn: 6 },
    { id: "bk-3", resource: "Studio slot 12:00", status: "confirmed" as ReservationState, holdExpiresIn: 0 }
  ],
  lastMessage: "Booking workflows should make holds, confirmations, cancellations, and remaining inventory explicit."
};

export function snapshot() {
  return structuredClone({
    summary: {
      available: state.reservations.filter((reservation) => reservation.status === "available").length,
      held: state.reservations.filter((reservation) => reservation.status === "held").length
    },
    reservations: state.reservations,
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "place-hold" | "confirm" | "cancel", value?: string) {
  state.reservations = state.reservations.map((reservation) => {
    if (reservation.id !== value) return reservation;
    if (type === "place-hold" && reservation.status === "available") {
      return { ...reservation, status: "held", holdExpiresIn: 10 };
    }
    if (type === "confirm" && reservation.status === "held") {
      return { ...reservation, status: "confirmed", holdExpiresIn: 0 };
    }
    if (type === "cancel" && reservation.status !== "cancelled") {
      return { ...reservation, status: "cancelled", holdExpiresIn: 0 };
    }
    return reservation;
  });
  state.lastMessage = `${type} processed for ${value}.`;
  return snapshot();
}
