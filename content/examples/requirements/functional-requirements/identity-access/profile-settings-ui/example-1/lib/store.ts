export type ProfileState = {
  name: string;
  title: string;
  timezone: string;
  visibility: "public" | "team" | "private";
  saveVersion: number;
  lastMessage: string;
};

export const profileState: ProfileState = {
  name: "Avery Quinn",
  title: "Staff Engineer",
  timezone: "America/Los_Angeles",
  visibility: "team",
  saveVersion: 3,
  lastMessage: "Profile has pending changes."
};
