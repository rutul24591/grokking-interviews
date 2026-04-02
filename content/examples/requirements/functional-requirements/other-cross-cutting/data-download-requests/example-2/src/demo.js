function evaluateDownloadRequests(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    canAutoGenerate: entry.identityVerified && entry.estimatedSizeGb < 10 && !entry.legalReviewRequired,
    splitArchive: entry.estimatedSizeGb >= 10 || entry.mediaHeavyAccount,
    requireFreshLink: entry.deliveryWindowExpired || entry.deviceMismatch
  }));
}

console.log(JSON.stringify(evaluateDownloadRequests([
  {
    "requestId": "dl-1",
    "identityVerified": true,
    "estimatedSizeGb": 2,
    "legalReviewRequired": false,
    "mediaHeavyAccount": false,
    "deliveryWindowExpired": false,
    "deviceMismatch": false
  },
  {
    "requestId": "dl-2",
    "identityVerified": true,
    "estimatedSizeGb": 24,
    "legalReviewRequired": false,
    "mediaHeavyAccount": true,
    "deliveryWindowExpired": false,
    "deviceMismatch": false
  },
  {
    "requestId": "dl-3",
    "identityVerified": false,
    "estimatedSizeGb": 4,
    "legalReviewRequired": true,
    "mediaHeavyAccount": false,
    "deliveryWindowExpired": true,
    "deviceMismatch": true
  }
]), null, 2));
