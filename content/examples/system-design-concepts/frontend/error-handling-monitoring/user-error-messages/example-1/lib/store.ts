export type UserError = { id: string; code: string; tone: 'blocking' | 'recoverable'; message: string; action: string };
export const messageState = {
  messages: [
    { id: 'u1', code: 'PAYMENT_DECLINED', tone: 'blocking' as const, message: 'Payment failed. Try another card or update billing details.', action: 'Open billing' },
    { id: 'u2', code: 'SEARCH_TIMEOUT', tone: 'recoverable' as const, message: 'Search took too long. Retry or narrow the query.', action: 'Retry search' }
  ],
  selectedId: 'u2',
  lastMessage: 'User-facing messages should explain the problem, next step, and whether recovery is possible.'
};
