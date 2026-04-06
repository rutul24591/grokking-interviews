/**
 * Audio/Video Player — Staff-Level Adaptive Bitrate Streaming.
 *
 * Staff differentiator: HLS/DASH integration with adaptive bitrate switching,
 * bandwidth estimation, and manual quality selection override.
 */

export interface QualityLevel {
  id: string;
  label: string; // e.g., "360p", "720p", "1080p"
  bitrate: number; // bits per second
  width: number;
  height: number;
  isAuto: boolean;
}

/**
 * Manages adaptive bitrate streaming with HLS.js integration.
 * Automatically switches quality based on bandwidth, with manual override support.
 */
export class AdaptiveBitrateManager {
  private currentQuality: number = -1; // -1 = auto
  private availableQualities: QualityLevel[] = [];
  private bandwidthHistory: number[] = [];
  private readonly BANDWIDTH_SAMPLES = 10;

  /**
   * Estimates current bandwidth and recommends a quality level.
   */
  estimateQuality(): number {
    if (this.bandwidthHistory.length === 0) return -1; // Auto

    const avgBandwidth = this.bandwidthHistory.reduce((a, b) => a + b, 0) / this.bandwidthHistory.length;

    // Find the highest quality that fits within estimated bandwidth (with 20% buffer)
    const targetBandwidth = avgBandwidth * 0.8;
    let bestIndex = 0;

    for (let i = 0; i < this.availableQualities.length; i++) {
      if (this.availableQualities[i].bitrate <= targetBandwidth) {
        bestIndex = i;
      }
    }

    return bestIndex;
  }

  /**
   * Records a bandwidth sample from the latest download.
   */
  recordBandwidth(bitsPerSecond: number): void {
    this.bandwidthHistory.push(bitsPerSecond);
    if (this.bandwidthHistory.length > this.BANDWIDTH_SAMPLES) {
      this.bandwidthHistory.shift();
    }
  }

  /**
   * Sets the quality level manually. Use -1 for auto.
   */
  setQuality(index: number): void {
    this.currentQuality = index;
  }

  /**
   * Returns the recommended quality (manual override or auto-estimated).
   */
  getRecommendedQuality(): number {
    return this.currentQuality >= 0 ? this.currentQuality : this.estimateQuality();
  }

  /**
   * Updates available quality levels from the manifest.
   */
  updateQualities(levels: QualityLevel[]): void {
    this.availableQualities = levels;
  }
}
