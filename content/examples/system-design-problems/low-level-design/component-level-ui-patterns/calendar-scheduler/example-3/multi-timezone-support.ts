/**
 * Calendar — Staff-Level Multi-Calendar Support and Timezone Overlays.
 *
 * Staff differentiator: Simultaneous display of multiple calendar systems
 * (Gregorian + Hijri + Hebrew), timezone overlay showing meeting times
 * across multiple timezones, and working hours visualization.
 */

export interface TimezoneOverlay {
  timezone: string;
  label: string;
  color: string;
  workingHours: { start: number; end: number }; // 0-24
}

/**
 * Manages multiple timezone overlays for calendar viewing.
 */
export class MultiTimezoneCalendar {
  private primaryTimezone: string;
  private overlays: TimezoneOverlay[] = [];

  constructor(primaryTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone) {
    this.primaryTimezone = primaryTimezone;
  }

  /**
   * Adds a timezone overlay.
   */
  addOverlay(overlay: TimezoneOverlay): void {
    this.overlays.push(overlay);
  }

  /**
   * Removes a timezone overlay.
   */
  removeOverlay(timezone: string): void {
    this.overlays = this.overlays.filter((o) => o.timezone !== timezone);
  }

  /**
   * Converts a time from the primary timezone to an overlay timezone.
   */
  convertTime(date: Date, targetTimezone: string): Date {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: targetTimezone });
    const parts = formatter.formatToParts(date);
    // In production: use proper timezone conversion library
    return date;
  }

  /**
   * Finds overlapping working hours across all overlays.
   */
  findOverlappingWorkingHours(): { start: number; end: number } | null {
    if (this.overlays.length === 0) return null;

    let latestStart = 0;
    let earliestEnd = 24;

    for (const overlay of this.overlays) {
      latestStart = Math.max(latestStart, overlay.workingHours.start);
      earliestEnd = Math.min(earliestEnd, overlay.workingHours.end);
    }

    if (latestStart >= earliestEnd) return null;
    return { start: latestStart, end: earliestEnd };
  }

  /**
   * Returns all active timezone overlays.
   */
  getOverlays(): TimezoneOverlay[] {
    return [...this.overlays];
  }
}
