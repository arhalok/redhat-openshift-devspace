/**
 * Standard API Response and Error Envelope
 * Section 32 of logistics-foundation.md
 */

export interface ApiSuccessResponse<T> {
  data: T;
  meta: {
    requestId: string;
    timestamp?: string;
  };
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  requestId: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export function createSuccessResponse<T>(data: T, requestId = crypto.randomUUID()): ApiSuccessResponse<T> {
  return {
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  requestId = crypto.randomUUID(),
  details?: Record<string, unknown>
): ApiErrorResponse {
  return {
    error: {
      code,
      message,
      requestId,
      details,
    },
  };
}
