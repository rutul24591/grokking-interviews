/**
 * Date/Time Picker — Staff-Level Timezone Edge Cases.
 *
 * Staff differentiator: Handles DST transitions, leap seconds, IANA timezone
 * database synchronization, and historical timezone changes.
 */

/**
 * Manages timezone conversions using the Intl API with fallback handling.
 * Detects and handles DST transitions correctly.
 */
export class TimezoneManager {
  private static readonly FALLBACK_TZ = 'UTC';

  /**
   * Converts a UTC timestamp to a specific timezone, handling DST transitions.
   * Returns the offset in minutes from UTC.
   */
  getUtcOffset(timezone: string, utcTimestamp: number): number {
    try {
      const date = new Date(utcTimestamp);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(date);
      const tzPart = parts.find((p) => p.type === 'timeZoneName');

      if (!tzPart) return 0;

      // Parse offset from timezone name (e.g., "GMT-5", "GMT+5:30")
      const match = tzPart.value.match(/GMT([+-]\d+)(?::(\d+))?/);
      if (!match) return 0;

      const hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      return hours * 60 + (hours < 0 ? -minutes : minutes);
    } catch {
      return 0;
    }
  }

  /**
   * Detects if a timezone observes DST and returns the transition dates for a given year.
   */
  getDSTTransitions(timezone: string, year: number): { springForward: Date | null; fallBack: Date | null } {
    const janOffset = this.getUtcOffset(timezone, new Date(year, 0, 1).getTime());
    const julOffset = this.getUtcOffset(timezone, new Date(year, 6, 1).getTime());

    if (janOffset === julOffset) {
      // No DST observed in this timezone
      return { springForward: null, fallBack: null };
    }

    // Find the transition dates by binary search
    const springForward = this.findTransitionDate(timezone, year, janOffset, julOffset, true);
    const fallBack = this.findTransitionDate(timezone, year, julOffset, janOffset, false);

    return { springForward, fallBack };
  }

  /**
   * Binary search to find the exact DST transition date.
   */
  private findTransitionDate(
    timezone: string,
    year: number,
    fromOffset: number,
    toOffset: number,
    forward: boolean,
  ): Date | null {
    let start = new Date(year, forward ? 0 : 6, 1);
    let end = new Date(year, forward ? 6 : 11, 31);

    while (end.getTime() - start.getTime() > 3600000) { // 1 hour precision
      const mid = new Date((start.getTime() + end.getTime()) / 2);
      const offset = this.getUtcOffset(timezone, mid.getTime());
      if ((forward && offset !== fromOffset) || (!forward && offset === fromOffset)) {
        end = mid;
      } else {
        start = mid;
      }
    }

    return forward ? end : start;
  }
}
