// Example usage of CIDR checks and private IP detection.

const { isPrivateIpv4 } = require("./ip-utils");
const { isAllowed } = require("./subnet-policy");

const samples = [
  "10.0.5.10",
  "10.0.6.10",
  "192.168.1.25",
  "8.8.8.8",
  "2001:db8::1",
  "2001:4860:4860::8888",
];

for (const ip of samples) {
  console.log(ip, {
    private: ip.includes(":") ? false : isPrivateIpv4(ip),
    allowed: isAllowed(ip),
  });
}
