// Example autoscaling decision
if (metrics.cpu > 0.7 and metrics.queueDepth > 100) {
  scaleOut(2);
}
