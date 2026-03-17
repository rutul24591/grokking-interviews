// Autoscaler deciding between scale-up and scale-out.

const { capacityForInstance, totalCapacity } = require("./capacity-model");

function decideScaling({ instances, demand, maxInstanceSize }) {
  const currentCapacity = totalCapacity(instances);
  if (currentCapacity >= demand) {
    return { action: "none", reason: "capacity-ok", capacity: currentCapacity };
  }

  const largest = instances.reduce((max, instance) =>
    capacityForInstance(instance) > capacityForInstance(max) ? instance : max
  );

  if (largest.cores < maxInstanceSize.cores || largest.memoryGb < maxInstanceSize.memoryGb) {
    const scaledUp = {
      ...largest,
      cores: Math.min(maxInstanceSize.cores, largest.cores * 2),
      memoryGb: Math.min(maxInstanceSize.memoryGb, largest.memoryGb * 2),
    };
    return { action: "scale-up", target: scaledUp };
  }

  const newInstance = { ...largest, id: `node-${instances.length + 1}` };
  return { action: "scale-out", target: newInstance };
}

module.exports = { decideScaling };
