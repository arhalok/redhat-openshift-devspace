import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '../../../../../lib/api/response';
import { defaultConsolidationService } from '../../../../../services/phase1-services';

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  const opportunities = await defaultConsolidationService.findOpportunities('ws-main');

  return NextResponse.json(createSuccessResponse(opportunities, requestId));
}
