const fs = require('fs');

function setDegradedMode() {
  const flags = { enablePersonalization: false, enablePriceRefresh: false };
  fs.writeFileSync('./feature-flags.json', JSON.stringify(flags, null, 2));
}

setDegradedMode();