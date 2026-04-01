export type PhoneVerificationState = {
  phone: string;
  status: "unverified" | "code-sent" | "verified";
  code: string;
  attempts: number;
  resendAvailableIn: number;
  lastMessage: string;
};

export const phoneState: PhoneVerificationState = {
  phone: "+1 415 555 0123",
  status: "unverified",
  code: "482911",
  attempts: 0,
  resendAvailableIn: 0,
  lastMessage: "Phone verification not started."
};
