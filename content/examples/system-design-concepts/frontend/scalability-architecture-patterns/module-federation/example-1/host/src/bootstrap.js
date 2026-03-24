import { Suspense, lazy, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

const RemoteButton = lazy(() => import("remoteApp/Button"));

function HostApp() {
  const [clicks, setClicks] = useState(0);
  const startedAt = useMemo(() => new Date().toISOString(), []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <h1>Host</h1>
      <p>
        Loaded a remote component at runtime via <code>remoteEntry.js</code>. Started at <code>{startedAt}</code>.
      </p>

      <Suspense fallback={<div>Loading remote...</div>}>
        <RemoteButton onClick={() => setClicks((c) => c + 1)}>Remote button (clicks: {clicks})</RemoteButton>
      </Suspense>

      <p style={{ marginTop: 16, opacity: 0.8 }}>
        Production note: handle remote unavailability (Example 3) and enforce compatibility contracts.
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<HostApp />);

