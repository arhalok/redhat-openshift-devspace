import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '../../../../lib/api/response';
import { BANGALORE_ROUTES } from '../../../../lib/demo-data';

export async function GET(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  return NextResponse.json(createSuccessResponse(BANGALORE_ROUTES, requestId));
}
