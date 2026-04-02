function detectReactionConflicts(states) {
  const conflicts = states.filter((state) => state.localReaction !== state.serverReaction).map((state) => state.entityId);
  const staleEmojiSets = states.filter((state) => state.pickerVersion !== state.serverPickerVersion).map((state) => state.entityId);
  return {
    conflicts,
    staleEmojiSets,
    refetch: conflicts.length > 0 || staleEmojiSets.length > 0,
    collapseToDefaultReactions: staleEmojiSets.length > 0
  };
}

console.log(detectReactionConflicts([
  { entityId: "post-1", localReaction: "🔥", serverReaction: "👍", pickerVersion: 2, serverPickerVersion: 3 },
  { entityId: "post-2", localReaction: "👏", serverReaction: "👏", pickerVersion: 3, serverPickerVersion: 3 }
]));
