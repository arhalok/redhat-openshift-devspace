import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '../../../../../../lib/api/response';
import { BANGALORE_ORDERS } from '../../../../../../lib/demo-data';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  const order = BANGALORE_ORDERS.find((o) => o.id === id || o.orderNumber === id);

  if (!order) {
    return NextResponse.json(
      createErrorResponse('ORDER_NOT_FOUND', `Order with ID ${id} was not found`, requestId),
      { status: 404 }
    );
  }

  // State transition: Section 54 invariant (delivered cannot return to draft; confirm is valid)
  const updatedOrder = {
    ...order,
    status: 'CONFIRMED' as const,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(createSuccessResponse(updatedOrder, requestId));
}
