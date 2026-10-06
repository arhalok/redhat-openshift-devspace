import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '../../../../../lib/api/response';
import { defaultResetService } from '../../../../../services/phase1-services';

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  const resetResult = await defaultResetService.resetDemoState();

  return NextResponse.json(
    createSuccessResponse(
      {
        ...resetResult,
        resetEntities: {
          ordersCount: 500,
          vehiclesReset: 100,
          exceptionsCleared: 3,
          routesRestored: 100,
        },
      },
      requestId
    )
  );
}
