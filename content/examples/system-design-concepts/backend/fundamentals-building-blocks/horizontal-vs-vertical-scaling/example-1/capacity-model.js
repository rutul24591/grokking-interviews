// Capacity model for a service instance.

function capacityForInstance(instance) {
  const cpuCapacity = instance.cores * 100;
  const memCapacity = instance.memoryGb * 50;
  const requestCapacity = Math.min(cpuCapacity, memCapacity, instance.concurrentLimit);
  return requestCapacity;
}

function totalCapacity(instances) {
  return instances.reduce((sum, instance) => sum + capacityForInstance(instance), 0);
}

module.exports = { capacityForInstance, totalCapacity };
