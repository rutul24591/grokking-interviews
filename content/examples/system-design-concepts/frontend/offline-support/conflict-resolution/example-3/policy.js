export function classifyResolution({ local, incoming }) {
  const relation = compareVectors(local.vector, incoming.vector);

  if (relation === "after" || relation === "equal") {
    return {
      relation,
      action: "keep-local",
      reason: "Local replica already includes the incoming state."
    };
  }

  if (relation === "before") {
    return {
      relation,
      action: "apply-incoming",
      reason: "Incoming state is causally newer than local state."
    };
  }

  return {
    relation,
    action: "manual-resolution",
    reason: "Concurrent edits require merge logic or a user-visible conflict flow."
  };
}

function compareVectors(localVector, incomingVector) {
  let beforeOrEqual = true;
  let afterOrEqual = true;
  const clients = new Set([...Object.keys(localVector), ...Object.keys(incomingVector)]);

  for (const client of clients) {
    const localValue = localVector[client] || 0;
    const incomingValue = incomingVector[client] || 0;
    if (localValue < incomingValue) {
      afterOrEqual = false;
    }
    if (localValue > incomingValue) {
      beforeOrEqual = false;
    }
  }

  if (beforeOrEqual && afterOrEqual) return "equal";
  if (beforeOrEqual) return "before";
  if (afterOrEqual) return "after";
  return "concurrent";
}
