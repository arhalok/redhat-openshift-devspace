import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '../../../../../lib/api/response';
import { defaultCapacityMatchingService } from '../../../../../services/phase1-services';

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  const body = await req.json().catch(() => ({}));
  const vehicleId = body.vehicleId || 'veh-027';

  const matches = await defaultCapacityMatchingService.findReturnLoads(vehicleId);

  return NextResponse.json(createSuccessResponse(matches, requestId));
}
