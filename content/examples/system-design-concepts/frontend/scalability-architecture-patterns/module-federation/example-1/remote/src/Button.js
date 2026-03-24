export default function RemoteButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#4f46e5",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "white",
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
}

