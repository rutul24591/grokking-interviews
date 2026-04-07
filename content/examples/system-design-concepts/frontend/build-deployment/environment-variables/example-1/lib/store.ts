export const envReleases = [
  {
    id: "checkout-prod",
    label: "Checkout production release",
    runtime: "NODE_ENV, CHECKOUT_API_URL, PAYMENT_REGION",
    publicVars: "NEXT_PUBLIC_BUILD_ID, NEXT_PUBLIC_ASSET_HOST",
    state: "healthy",
    finding: "Public and private boundaries are enforced",
    plan: [
      "Validate required runtime keys before boot.",
      "Compare non-secret values across preview and production.",
      "Ship only after bundle scan confirms no secrets leaked."
    ]
  },
  {
    id: "search-preview",
    label: "Search preview release",
    runtime: "SEARCH_BACKEND_URL, SEARCH_API_TOKEN",
    publicVars: "NEXT_PUBLIC_SEARCH_INDEX, NEXT_PUBLIC_REGION",
    state: "watch",
    finding: "One token-like variable was about to enter the client bundle",
    plan: [
      "Move the sensitive value behind a server route.",
      "Rotate the token if preview builds already exposed it.",
      "Add lint validation for future build contracts."
    ]
  },
  {
    id: "profile-prod",
    label: "Profile production release",
    runtime: "PROFILE_API_URL, AVATAR_BUCKET, SESSION_COOKIE_DOMAIN",
    publicVars: "NEXT_PUBLIC_AVATAR_CDN",
    state: "repair",
    finding: "A required runtime variable is missing in production",
    plan: [
      "Fail readiness checks until the key exists.",
      "Keep traffic on the previous release contract.",
      "Record the missing key in deploy evidence."
    ]
  }
] as const;

export const safeguards = [
  "Secrets never belong in the client bundle contract.",
  "Runtime configuration must fail closed when required keys are absent.",
  "Diff preview and production config before every promotion."
] as const;
