export type UploadItem = {
  id: string;
  name: string;
  sizeMb: number;
  status: "queued" | "uploading" | "processing" | "failed" | "complete";
  progress: number;
  retryable: boolean;
};

export const uploadItems: UploadItem[] = [
  { id: "1", name: "architecture.svg", sizeMb: 2, status: "complete", progress: 100, retryable: false },
  { id: "2", name: "incident-timeline.pdf", sizeMb: 18, status: "processing", progress: 100, retryable: false },
  { id: "3", name: "customer-export.zip", sizeMb: 42, status: "failed", progress: 66, retryable: true }
];

export const uploadPolicies = {
  maxFiles: 5,
  maxSizeMb: 50,
  acceptedExtensions: ["svg", "pdf", "zip", "png"],
  warning: "Hold submit if any upload is still processing or failed without an operator decision."
};
