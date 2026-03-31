function evaluateOrder(order, viewer) {
  const authFirst = order[0] === "withEntitlement";
  return {
    order: order.join(" -> "),
    logsDeniedViews: order.includes("withLogging") && (!viewer.premiumExamples || !authFirst),
    blocksBeforeLogging: authFirst && !viewer.premiumExamples
  };
}

console.log(evaluateOrder(["withLogging", "withEntitlement", "ArticleCard"], { premiumExamples: false }));
console.log(evaluateOrder(["withEntitlement", "withLogging", "ArticleCard"], { premiumExamples: false }));
