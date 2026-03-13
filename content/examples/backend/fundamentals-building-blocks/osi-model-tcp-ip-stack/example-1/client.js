// Simulates a request moving down the OSI/TCP-IP layers.

const { describe } = require("./packet");
const {
  applicationLayer,
  transportLayer,
  networkLayer,
  dataLinkLayer,
  physicalLayer,
} = require("./layers");

const app = applicationLayer("body: ping");
const transport = transportLayer(app);
const network = networkLayer(transport);
const link = dataLinkLayer(network);
const physical = physicalLayer(link);

describe(physical);
