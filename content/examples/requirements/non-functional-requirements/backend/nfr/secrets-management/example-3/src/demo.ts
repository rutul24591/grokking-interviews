type Envelope = {
  ciphertext: string;
  encryptedDataKey: string;
  kid: string; // master key id
};

const example: Envelope = {
  ciphertext: "<encrypted bytes>",
  encryptedDataKey: "<kms-encrypted data key>",
  kid: "kms-key-1"
};

console.log(JSON.stringify(example, null, 2));

