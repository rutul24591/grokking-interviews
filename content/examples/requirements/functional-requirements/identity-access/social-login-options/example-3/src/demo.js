function fallbackOrder(providerStatus) {
  return providerStatus.filter((provider) => provider.available).map((provider) => provider.name);
}

console.log(fallbackOrder([{ name: "google", available: true }, { name: "microsoft", available: false }, { name: "github", available: true }]));
