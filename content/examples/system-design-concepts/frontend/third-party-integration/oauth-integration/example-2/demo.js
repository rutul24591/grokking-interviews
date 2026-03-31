const issuedState = "state_abc";
const callbackState = "state_abc";

console.log(callbackState === issuedState ? "state valid -> continue exchange" : "state mismatch -> reject callback");
