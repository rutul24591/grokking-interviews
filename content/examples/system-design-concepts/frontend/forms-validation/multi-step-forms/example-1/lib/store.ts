export const steps = [
  { id: "workspace", title: "Workspace", hint: "Name the environment and region." },
  { id: "reviewers", title: "Reviewers", hint: "Assign approval owners." },
  { id: "confirm", title: "Confirm", hint: "Validate the summary before activation." }
];

export const stepDefaults = {
  workspaceName: "",
  region: "",
  reviewers: "",
  complianceAck: false
};
