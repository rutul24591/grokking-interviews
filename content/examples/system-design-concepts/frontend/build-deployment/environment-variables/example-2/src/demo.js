function evaluateEnvContract(contract) {
  const actions = [];

  if (contract.publicVars.some((name) => name.includes("TOKEN") || name.includes("SECRET"))) {
    actions.push("remove-sensitive-value-from-client-contract");
  }
  if (contract.requiredRuntimeMissing.length > 0) {
    actions.push("block-boot-until-runtime-contract-restored");
  }
  if (!contract.previewProdParity) {
    actions.push("diff-preview-and-production-config");
  }

  return { id: contract.id, safeToShip: actions.length === 0, actions };
}

const contracts = [
  { id: "healthy", publicVars: ["NEXT_PUBLIC_BUILD_ID"], requiredRuntimeMissing: [], previewProdParity: true },
  { id: "leak", publicVars: ["NEXT_PUBLIC_BUILD_ID", "NEXT_PUBLIC_SECRET_TOKEN"], requiredRuntimeMissing: [], previewProdParity: true },
  { id: "runtime-gap", publicVars: ["NEXT_PUBLIC_ASSET_HOST"], requiredRuntimeMissing: ["CHECKOUT_API_URL"], previewProdParity: false }
];

console.log(contracts.map(evaluateEnvContract));
