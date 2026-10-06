/**
 * API Contract Conventions
 * Section 17 of Phase 1 Technical Specification
 */

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    requestId: string;
    timestamp: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId: string;
    timestamp: string;
  };
}

export function apiSuccess<T>(data: T, requestId = crypto.randomUUID()): ApiSuccess<T> {
  return {
    success: true,
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}

export function apiError(
  code: string,
  message: string,
  details?: unknown,
  requestId = crypto.randomUUID()
): ApiError {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}
