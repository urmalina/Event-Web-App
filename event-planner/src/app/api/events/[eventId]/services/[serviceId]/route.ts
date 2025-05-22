import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/events/[eventId]/services/[serviceId]
export async function PATCH(
  req: NextRequest,
  context: { params: { eventId: string; serviceId: string } }
) {
  const { eventId, serviceId } = await context.params;
  const body = await req.json();

  const updated = await prisma.eventService.updateMany({
    where: {
      eventId,
      serviceId,
    },
    data: {
      selectedStart: body.selectedStart ? new Date(body.selectedStart) : null,
      selectedEnd: body.selectedEnd ? new Date(body.selectedEnd) : null,
      draft: body.draft ?? true,
    },
  });

  return NextResponse.json({ updated });
}

// DELETE /api/events/[eventId]/services/[serviceId]
export async function DELETE(
    req: NextRequest,
    context: { params: { eventId: string; serviceId: string } }
  ) {
    const { serviceId } = await context.params;
  
    await prisma.eventService.delete({
      where: { id: serviceId }, // <-- используем primary key!
    });
  
    return NextResponse.json({ success: true });
  }
  
  