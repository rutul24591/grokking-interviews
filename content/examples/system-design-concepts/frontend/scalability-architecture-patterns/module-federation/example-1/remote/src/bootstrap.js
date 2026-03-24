import { createRoot } from "react-dom/client";

function RemoteApp() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <h1>Remote</h1>
      <p>This app exposes a federated module: <code>remoteApp/Button</code>.</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<RemoteApp />);

