import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '../../../../../lib/api/response';
import { BANGALORE_ORDERS } from '../../../../../lib/demo-data';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  const order = BANGALORE_ORDERS.find((o) => o.id === id || o.orderNumber === id);

  if (!order) {
    return NextResponse.json(
      createErrorResponse('ORDER_NOT_FOUND', `Order with ID ${id} was not found`, requestId),
      { status: 404 }
    );
  }

  return NextResponse.json(createSuccessResponse(order, requestId));
}
