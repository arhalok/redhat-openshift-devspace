import { NextRequest, NextResponse } from 'next/server';
import { AIQuerySchema } from '../../../../../lib/validation/schemas';
import { createSuccessResponse, createErrorResponse } from '../../../../../lib/api/response';

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const body = await req.json();
    const parsed = AIQuerySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_FAILED',
          'Invalid AI query: ' + parsed.error.issues.map((i: { message: string }) => i.message).join(', '),
          requestId
        ),
        { status: 400 }
      );
    }

    const promptText = parsed.data.prompt || parsed.data.query || '';
    const lower = promptText.toLowerCase();

    // Guardrail: Return structured output matching Section 51
    let summary: string;
    let evidence: string[];
    let recommendations: string[];
    let proposedActions: Array<{
      actionId: string;
      label: string;
      actionType: string;
      requiresConfirmation: boolean;
      impact: Record<string, unknown>;
    }> = [];

    if (lower.includes('delay') || lower.includes('late') || lower.includes('risk')) {
      summary = '11 deliveries are currently at risk across the Bangalore distribution network.';
      evidence = [
        '5 vehicle reassignment bottlenecks on arterial corridors',
        '3 supplier lead-time delays at Kaveri Perishables cold facility',
        '2 overloaded routes exceeding cubic capacity envelope (Route R-124)',
        '1 warehouse staging delay at Central Depot',
      ];
      recommendations = [
        'Move stops 4 and 5 from Route R-124 to Route R-131 to preserve SLA buffer.',
      ];
      proposedActions = [
        {
          actionId: 'act-reassign-stops-124',
          label: 'Move stops 4 and 5 to Route R-131',
          actionType: 'REASSIGN_STOPS',
          requiresConfirmation: true, // Guardrail (Section 29)
          impact: { delayAvoidedMinutes: 22, storesProtected: 3 },
        },
      ];
    } else if (lower.includes('stockout') || lower.includes('store')) {
      summary = 'Laxmi Retail (Jayanagar) is at critical stockout risk with 1 bag of Atta remaining.';
      evidence = [
        'Current on-hand inventory: 1 bag of Aashirvaad Atta 10kg',
        'Cluster checkout velocity: 5.4 bags/day',
        'Stockout projected in 3.6 hours',
        'Supplier lead time: 18 hours with 97% verified fill rate',
      ];
      recommendations = [
        'Batch emergency replenishment order with Apex FMCG Hub.',
      ];
      proposedActions = [
        {
          actionId: 'act-replenish-atta',
          label: 'Create priority order for 12 bags Atta',
          actionType: 'CREATE_ORDER',
          requiresConfirmation: true,
          impact: { stockoutAverted: true, confidence: 0.92 },
        },
      ];
    } else if (lower.includes('capacity') || lower.includes('return') || lower.includes('backhaul')) {
      summary = 'Vehicle V-027 has 38% unused return capacity along Old Madras Road corridor.';
      evidence = [
        'Vehicle V-027 completing 6 drops with 190 kg surplus payload space',
        'Delta East Hub has 340 kg secondary packaging load ready for depot return',
        'Pickup deviation is 2.8 km',
      ];
      recommendations = [
        'Assign backhaul load to V-027 to boost utilization from 62% to 91%.',
      ];
      proposedActions = [
        {
          actionId: 'act-add-backhaul-v27',
          label: 'Assign Delta Hub return load to V-027',
          actionType: 'ASSIGN_RETURN_LOAD',
          requiresConfirmation: true,
          impact: { utilizationBoost: '29%', revenueRecoveryPaise: 185000 },
        },
      ];
    } else {
      summary = 'Network telemetry is operating within normal bounds across 61 routes.';
      evidence = [
        'On-time delivery SLA compliance: 94.2%',
        'Average vehicle capacity utilization: 76.4%',
        'Active exceptions: 3 items requiring supervisor review',
      ];
      recommendations = [
        'Review open exceptions in Control Tower.',
      ];
    }

    return NextResponse.json(
      createSuccessResponse(
        {
          summary,
          evidence,
          recommendations,
          proposedActions,
        },
        requestId
      )
    );
  } catch (error: any) {
    return NextResponse.json(
      createErrorResponse('AI_QUERY_FAILED', error.message || 'AI processing failed', requestId),
      { status: 500 }
    );
  }
}
