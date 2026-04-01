export const socialState = {
  providers: [
    { name: "google", available: true, enterpriseReady: true },
    { name: "github", available: true, enterpriseReady: false },
    { name: "microsoft", available: false, enterpriseReady: true }
  ],
  selectedProvider: "google",
  lastMessage: "Choose a social login provider."
};
