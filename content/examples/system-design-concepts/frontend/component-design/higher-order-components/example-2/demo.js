function preserveMetadata(baseComponent) {
  return {
    displayName: `withEntitlement(${baseComponent.displayName ?? baseComponent.name})`,
    staticKeysPreserved: ["roleRequirements", "analyticsKey"].filter((key) => key in baseComponent)
  };
}

console.log(preserveMetadata({ name: "ArticleCard", roleRequirements: ["staff"], analyticsKey: "article_card" }));
console.log(preserveMetadata({ name: "RecommendationsRail" }));
