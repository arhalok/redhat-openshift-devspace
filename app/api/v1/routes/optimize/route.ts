import { NextRequest, NextResponse } from 'next/server';
import { OptimizeRoutesSchema } from '../../../../../lib/validation/schemas';
import { createSuccessResponse, createErrorResponse } from '../../../../../lib/api/response';
import { defaultOptimizationService } from '../../../../../services/phase1-services';

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const body = await req.json();
    const parsed = OptimizeRoutesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_FAILED',
          'Invalid optimize request: ' + parsed.error.issues.map((i) => i.message).join(', '),
          requestId
        ),
        { status: 400 }
      );
    }

    const plans = await defaultOptimizationService.optimize(parsed.data);

    return NextResponse.json(
      createSuccessResponse(
        {
          optimizationRunId: `run-${Date.now()}`,
          plans,
          summary: {
            totalRoutes: plans.length,
            totalDistanceKm: Number(plans.reduce((sum, p) => sum + p.totalDistanceKm, 0).toFixed(1)),
            averageUtilization: Number(
              (plans.reduce((sum, p) => sum + p.utilizationPercent, 0) / plans.length).toFixed(1)
            ),
          },
        },
        requestId
      )
    );
  } catch (error: any) {
    return NextResponse.json(
      createErrorResponse('OPTIMIZATION_FAILED', error.message || 'Optimization failed', requestId),
      { status: 500 }
    );
  }
}
