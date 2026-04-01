export type LogEvent = { id: string; level: 'info' | 'warn' | 'error'; category: string; message: string };
export const loggingState = {
  samplingRate: 1,
  events: [
    { id: 'l1', level: 'error' as const, category: 'ui', message: 'Render failure in recommendation rail' },
    { id: 'l2', level: 'warn' as const, category: 'network', message: 'Search request exceeded budget' }
  ],
  lastMessage: 'Client logs should be structured, sampled, and tagged by category before export.'
};
