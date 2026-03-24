type Event =
  | { type: "status"; message: string }
  | { type: "alert"; message: string };

type Listener = (evt: Event) => void;

class AnnouncerBus {
  private listeners = new Set<Listener>();

  publish(evt: Event) {
    for (const l of this.listeners) l(evt);
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const announcer = new AnnouncerBus();

