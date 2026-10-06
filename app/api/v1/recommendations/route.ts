import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '../../../../lib/api/response';
import { defaultDemandService } from '../../../../services/phase1-services';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get('storeId') || 'store-1';
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  const recommendations = await defaultDemandService.getReplenishmentRecommendations(storeId);

  return NextResponse.json(createSuccessResponse(recommendations, requestId));
}
