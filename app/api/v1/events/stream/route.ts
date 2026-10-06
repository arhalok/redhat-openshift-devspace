import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  // Create an SSE stream emitting telemetry updates
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`)
      );

      // Periodic telemetry updates (vehicle.position.updated, order.status.changed)
      const interval = setInterval(() => {
        const events = [
          {
            type: 'vehicle.position.updated',
            payload: {
              vehicleId: 'veh-027',
              latitude: 12.962 + (Math.random() - 0.5) * 0.001,
              longitude: 77.632 + (Math.random() - 0.5) * 0.001,
              speedKmH: 24,
            },
          },
          {
            type: 'order.status.changed',
            payload: {
              orderId: 'ord-10284',
              status: 'IN_TRANSIT',
              eta: '14:20',
            },
          },
        ];

        const ev = events[Math.floor(Math.random() * events.length)];
        controller.enqueue(
          encoder.encode(`event: ${ev.type}\ndata: ${JSON.stringify(ev.payload)}\n\n`)
        );
      }, 5000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
