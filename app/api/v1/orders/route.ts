import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderSchema } from '../../../../lib/validation/schemas';
import { createSuccessResponse, createErrorResponse } from '../../../../lib/api/response';
import { BANGALORE_ORDERS, OrderRecord } from '../../../../lib/demo-data';

// In-memory persistent order registry for demo runtime
let liveOrders: OrderRecord[] = [...BANGALORE_ORDERS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const storeId = searchParams.get('storeId');

  let results = liveOrders;
  if (status) {
    results = results.filter((o) => o.status === status);
  }
  if (storeId) {
    results = results.filter((o) => o.id.includes(storeId));
  }

  return NextResponse.json(createSuccessResponse(results));
}

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  const idempotencyKey = req.headers.get('idempotency-key');

  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_FAILED',
          'Invalid order payload: ' + parsed.error.issues.map((i) => i.message).join(', '),
          requestId
        ),
        { status: 400 }
      );
    }

    const { storeId, supplierId, items } = parsed.data;

    // Recalculate totals server-side (Section 16: Never trust client-provided totals)
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const deliveryFee = 150.0;
    const discount = 0.0;
    const total = subtotal + deliveryFee - discount;

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      storeName: storeId,
      storeLocality: 'Indiranagar',
      valuePaise: Math.round(total * 100),
      supplierName: supplierId,
      status: 'CONFIRMED',
      deliveryRoute: 'Route R-124',
      vehicleCode: 'V-027',
      createdAt: new Date().toISOString(),
      eta: 'Tomorrow 10:00',
      itemCount: items.length,
      items: items.map((i) => ({
        name: i.productId,
        quantity: i.quantity,
        unitPricePaise: Math.round(i.unitPrice * 100),
      })),
      timeline: [
        { time: 'Just now', event: 'Order confirmed and registered via API v1', status: 'DONE' },
        { time: 'Today 18:00', event: 'Staging in dispatch bay', status: 'PENDING' },
      ],
    };

    liveOrders = [newOrder, ...liveOrders];

    return NextResponse.json(createSuccessResponse(newOrder, requestId), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      createErrorResponse('INTERNAL_SERVER_ERROR', error.message || 'Failed to create order', requestId),
      { status: 500 }
    );
  }
}
