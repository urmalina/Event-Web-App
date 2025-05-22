import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

// Вытаскиваем userId из cookie
function getUserIdFromRequest(req: NextRequest): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  try {
    const session = cookies.session ? JSON.parse(decodeURIComponent(cookies.session)) : null;
    return session?.userId ?? null;
  } catch {
    return null;
  }
}

// GET /api/events/[eventId]
export async function GET(req: NextRequest, context: { params: { eventId: string } }) {
  const { eventId } = await context.params; 

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const event = await prisma.event.findUnique({
    where: { id: eventId, userId },
    include: {
      venue: true, 
      services: {
        include: { service: true },
      },
      bookings: {
        include: { service: true },
      },
    },
  });
  

  if (!event) {
    return NextResponse.json({ message: "Событие не найдено" }, { status: 404 });
  }

  return NextResponse.json(event);
}

//PATCH /api/events/[eventId]
export async function PATCH(req: NextRequest, context: { params: { eventId: string } }) {
  const { eventId } = await context.params;

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const updated = await prisma.event.updateMany({
    where: { id: eventId, userId },
    data: {
      title: body.title,
      type: body.type,
      guestsCount: body.guestsCount,
      date: body.date ? new Date(body.date) : undefined,
      budget: body.budget,
      venueId: body.venueId ?? undefined,
    },
  });
  

  return NextResponse.json({ updated });
}

// DELETE /api/events/[eventId]
export async function DELETE(req: NextRequest, context: { params: { eventId: string } }) {
  const { eventId } = await context.params;

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.event.deleteMany({
    where: { id: eventId, userId },
  });

  return NextResponse.json({ success: true });
}
