type Policy = { deleteAfterDays: number };
type Record = { id: string; userId: string; createdAt: number };

function shouldDelete(params: {
  policy: Policy;
  nowMs: number;
  record: Record;
  legalHoldUsers: Set<string>;
  rtbfUsers: Set<string>;
}) {
  const ageDays = (params.nowMs - params.record.createdAt) / (1000 * 60 * 60 * 24);
  if (params.rtbfUsers.has(params.record.userId)) return { delete: true, reason: "rtbf" };
  if (params.legalHoldUsers.has(params.record.userId)) return { delete: false, reason: "legal_hold" };
  if (ageDays >= params.policy.deleteAfterDays) return { delete: true, reason: "ttl" };
  return { delete: false, reason: "keep" };
}

const nowMs = Date.now();
const r: Record = { id: "e1", userId: "u1", createdAt: nowMs - 10 * 24 * 60 * 60 * 1000 };

console.log(
  JSON.stringify(
    {
      rtbfWins: shouldDelete({
        policy: { deleteAfterDays: 30 },
        nowMs,
        record: r,
        legalHoldUsers: new Set(["u1"]),
        rtbfUsers: new Set(["u1"])
      })
    },
    null,
    2
  )
);

