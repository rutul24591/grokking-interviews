function chooseStrategy({ needsLiveValidation, syncsOtherFields, storesDraft }) {
  const score = [needsLiveValidation, syncsOtherFields, storesDraft].filter(Boolean).length;
  return score >= 2 ? "controlled" : "uncontrolled";
}

console.log(chooseStrategy({ needsLiveValidation: true, syncsOtherFields: true, storesDraft: false }));
console.log(chooseStrategy({ needsLiveValidation: false, syncsOtherFields: false, storesDraft: false }));
