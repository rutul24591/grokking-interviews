function canDeleteContent(item) {
  return {
    allowed: !item.protected,
    reason: item.protected ? "protected-content" : "allowed"
  };
}

console.log(canDeleteContent({ protected: true }));
