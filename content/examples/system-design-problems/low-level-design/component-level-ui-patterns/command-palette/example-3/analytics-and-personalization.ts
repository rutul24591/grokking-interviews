/**
 * Command Palette — Staff-Level Analytics and Usage Insights.
 *
 * Staff differentiator: Command usage analytics, search term analysis for
 * missing commands, and personalized command ranking based on user behavior.
 */

export interface CommandUsageEvent {
  commandId: string;
  queryUsed: string;
  position: number; // Position in results list
  timeToExecute: number; // ms from palette open to execution
  timestamp: number;
}

/**
 * Tracks command palette usage for analytics and personalization.
 */
export class CommandPaletteAnalytics {
  private events: CommandUsageEvent[] = [];
  private commandCounts: Map<string, number> = new Map();
  private searchTerms: Map<string, number> = new Map();

  /**
   * Records a command execution event.
   */
  recordExecution(event: CommandUsageEvent): void {
    this.events.push(event);
    this.commandCounts.set(event.commandId, (this.commandCounts.get(event.commandId) || 0) + 1);

    // Track search terms
    if (event.queryUsed) {
      this.searchTerms.set(event.queryUsed, (this.searchTerms.get(event.queryUsed) || 0) + 1);
    }
  }

  /**
   * Returns the most frequently used commands.
   */
  getTopCommands(limit: number = 10): { commandId: string; count: number }[] {
    return Array.from(this.commandCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([commandId, count]) => ({ commandId, count }));
  }

  /**
   * Returns search terms that returned no results (missing commands).
   */
  getMissingCommands(): { term: string; count: number }[] {
    return Array.from(this.searchTerms.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([term, count]) => ({ term, count }));
  }

  /**
   * Personalizes command ranking based on user's usage patterns.
   */
  getPersonalizedRanking(commands: string[]): string[] {
    return [...commands].sort((a, b) => {
      const countA = this.commandCounts.get(a) || 0;
      const countB = this.commandCounts.get(b) || 0;
      return countB - countA;
    });
  }

  /**
   * Calculates average time to execute a command.
   */
  getAvgExecutionTime(commandId?: string): number {
    const events = commandId
      ? this.events.filter((e) => e.commandId === commandId)
      : this.events;

    if (events.length === 0) return 0;
    return events.reduce((sum, e) => sum + e.timeToExecute, 0) / events.length;
  }
}
