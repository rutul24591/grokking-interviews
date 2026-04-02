export type Purpose = "support" | "billing" | "analytics";

export type Profile = {
  userId: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  deleted: boolean;
};

export function redact(profile: Profile, purpose: Purpose) {
  if (profile.deleted) {
    return { userId: profile.userId, deleted: true };
  }

  if (purpose === "analytics") {
    return { userId: profile.userId, displayName: profile.displayName, deleted: false };
  }
  if (purpose === "support") {
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      email: profile.email.replace(/(.).+(@.+)/, "$1***$2"),
      phone: profile.phone.replace(/\d(?=\d{2})/g, "*"),
      deleted: false,
    };
  }
  // billing
  return {
    userId: profile.userId,
    displayName: profile.displayName,
    address: profile.address,
    deleted: false,
  };
}

