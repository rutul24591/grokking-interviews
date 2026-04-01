function degradeModules(modules, requiredModules) {
  return requiredModules.map((module) => ({
    module,
    state: modules[module]?.length ? "ready" : "fallback"
  }));
}

console.log(degradeModules({ trending: [], recommended: ["r1"], recent: [] }, ["trending", "recommended", "recent"]));
