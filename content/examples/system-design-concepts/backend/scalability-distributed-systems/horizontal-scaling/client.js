// Trigger autoscaling on high CPU
if (metrics.cpu > 0.7) scaleOut(2);
