import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

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

// GET /api/events/[eventId]/services?draft=true
export async function GET(
  req: NextRequest,
  context: { params: { eventId: string } }
) {
  const { eventId } = await context.params;
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const draftParam = req.nextUrl.searchParams.get("draft");
  const draft = draftParam === "true";

  const services = await prisma.eventService.findMany({
    where: {
      eventId,
      draft,
    },
    include: {
      service: true,
    },
  });

  return NextResponse.json(services);
}

// POST /api/events/[eventId]/services
export async function POST(
  req: NextRequest,
  context: { params: { eventId: string } }
) {
  const { eventId } = await context.params;
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const created = await prisma.eventService.create({
    data: {
      eventId,
      serviceId: body.serviceId,
      draft: true,
      selectedStart: body.selectedStart ? new Date(body.selectedStart) : null,
      selectedEnd: body.selectedEnd ? new Date(body.selectedEnd) : null,
    },
  });

  return NextResponse.json(created);
}
