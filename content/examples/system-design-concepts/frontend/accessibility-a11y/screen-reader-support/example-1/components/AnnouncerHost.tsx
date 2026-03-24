"use client";

import { useEffect, useState } from "react";
import { announcer } from "@/lib/announcerBus";

export function AnnouncerHost() {
  const [status, setStatus] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const unsub = announcer.subscribe((evt) => {
      if (evt.type === "status") {
        // Clear first so identical messages re-announce in some ATs.
        setStatus("");
        window.setTimeout(() => setStatus(evt.message), 10);
      } else {
        setAlert("");
        window.setTimeout(() => setAlert(evt.message), 10);
      }
    });
    return unsub;
  }, []);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </div>
      <div className="sr-only" role="alert" aria-atomic="true">
        {alert}
      </div>
    </>
  );
}

