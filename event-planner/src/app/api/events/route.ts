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

/// GET /api/events?draft=true
export async function GET(req: NextRequest) {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
    const draftParam = req.nextUrl.searchParams.get("draft");
    const draft = draftParam === "true" ? true : draftParam === "false" ? false : undefined;
  
    const events = await prisma.event.findMany({
      where: {
        userId,
        ...(draft !== undefined && { draft })
      },
      include: {
        venue: true, // ⬅️ ДОБАВЬ ЭТО
        services: {
          include: { service: true }
        },
        bookings: true
      }
    });
  
    return NextResponse.json(events);
  }
  

// POST /api/events
export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const created = await prisma.event.create({
    data: {
      userId,
      title: body.title ?? "",
      type: body.type ?? null,
      guestsCount: body.guestsCount ?? null,
      location: body.location ?? null,
      budget: body.budget ?? null,
      draft: true, // создаём как черновик
    }
  });

  return NextResponse.json(created);
}
