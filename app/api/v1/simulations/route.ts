import { NextRequest, NextResponse } from 'next/server';
import { RunSimulationSchema } from '../../../../lib/validation/schemas';
import { createSuccessResponse, createErrorResponse } from '../../../../lib/api/response';
import { defaultSimulationService } from '../../../../services/phase1-services';

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const body = await req.json();
    const parsed = RunSimulationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_FAILED',
          'Invalid simulation parameters: ' + parsed.error.issues.map((i) => i.message).join(', '),
          requestId
        ),
        { status: 400 }
      );
    }

    const result = await defaultSimulationService.run(parsed.data);

    return NextResponse.json(createSuccessResponse(result, requestId));
  } catch (error: any) {
    return NextResponse.json(
      createErrorResponse('SIMULATION_FAILED', error.message || 'Simulation failed', requestId),
      { status: 500 }
    );
  }
}
