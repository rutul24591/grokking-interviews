export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } };

// Contract shapes go here (request/response). Keep them versioned for evolvability.
export type RequestMeta = { requestId: string; idempotencyKey?: string };
