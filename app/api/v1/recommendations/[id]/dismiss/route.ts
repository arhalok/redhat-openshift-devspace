import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '../../../../../../lib/api/response';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  return NextResponse.json(
    createSuccessResponse(
      {
        recommendationId: id,
        status: 'DISMISSED',
        dismissedAt: new Date().toISOString(),
      },
      requestId
    )
  );
}
