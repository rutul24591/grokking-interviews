function canRevoke(session) {
  return { id: session.id, allowed: !session.current };
}

console.log(canRevoke({ id: 'sess-1', current: true }));
console.log(canRevoke({ id: 'sess-2', current: false }));
