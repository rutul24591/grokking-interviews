"use client";

import { useReportWebVitals } from "next/web-vitals";

type WebVitalsMetric = {
  id: string;
  name: string;
  startTime: number;
  value: number;
  delta: number;
  rating: "good" | "needs-improvement" | "poor";
};

export function WebVitalsReporter() {
  useReportWebVitals((metric: WebVitalsMetric) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`
      );
    }

    // In production, send to your analytics provider:
    // navigator.sendBeacon('/api/analytics', JSON.stringify(metric));
  });

  return null;
}
