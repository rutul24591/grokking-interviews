/**
 * Rating Stars — Staff-Level Analytics and A/B Testing.
 *
 * Staff differentiator: Rating interaction analytics, A/B testing for
 * star count (5 vs 10 stars), and user rating pattern analysis.
 */

export interface RatingInteraction {
  userId: string;
  itemId: string;
  rating: number;
  timeToRate: number; // ms from component mount to rating
  wasHovered: boolean;
  wasChanged: boolean; // Did user change rating after initial selection?
  timestamp: number;
}

/**
 * Tracks rating interactions for analytics and A/B testing.
 */
export class RatingAnalytics {
  private interactions: RatingInteraction[] = [];
  private mountTime: number = Date.now();
  private hasHovered: boolean = false;
  private initialRating: number | null = null;
  private a11yGroup: string; // A/B test group

  constructor(a11yGroup: string = 'control') {
    this.a11yGroup = a11yGroup;
  }

  /**
   * Records a rating submission.
   */
  submitRating(userId: string, itemId: string, rating: number): RatingInteraction {
    const interaction: RatingInteraction = {
      userId,
      itemId,
      rating,
      timeToRate: Date.now() - this.mountTime,
      wasHovered: this.hasHovered,
      wasChanged: this.initialRating !== null && this.initialRating !== rating,
      timestamp: Date.now(),
    };

    this.interactions.push(interaction);
    this.sendToAnalytics(interaction);
    return interaction;
  }

  /**
   * Records that the user hovered over the stars.
   */
  recordHover(): void {
    this.hasHovered = true;
  }

  /**
   * Records the initial rating selection.
   */
  recordInitialRating(rating: number): void {
    if (this.initialRating === null) {
      this.initialRating = rating;
    }
  }

  /**
   * Calculates average rating for an item.
   */
  getAverageRating(itemId: string): number {
    const itemRatings = this.interactions.filter((i) => i.itemId === itemId);
    if (itemRatings.length === 0) return 0;
    return itemRatings.reduce((sum, i) => sum + i.rating, 0) / itemRatings.length;
  }

  /**
   * Compares A/B test groups for rating distribution.
   */
  compareABTest(): Record<string, { count: number; avgRating: number; avgTimeToRate: number }> {
    const groups: Record<string, RatingInteraction[]> = {};
    for (const interaction of this.interactions) {
      if (!groups[this.a11yGroup]) groups[this.a11yGroup] = [];
      groups[this.a11yGroup].push(interaction);
    }

    const result: Record<string, { count: number; avgRating: number; avgTimeToRate: number }> = {};
    for (const [group, interactions] of Object.entries(groups)) {
      result[group] = {
        count: interactions.length,
        avgRating: interactions.reduce((sum, i) => sum + i.rating, 0) / interactions.length,
        avgTimeToRate: interactions.reduce((sum, i) => sum + i.timeToRate, 0) / interactions.length,
      };
    }

    return result;
  }

  private sendToAnalytics(interaction: RatingInteraction): void {
    // In production: send to analytics service
    console.log('[Rating Analytics]', interaction);
  }
}
