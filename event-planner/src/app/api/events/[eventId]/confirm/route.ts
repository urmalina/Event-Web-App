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

// POST /api/events/[eventId]/confirm
export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const eventId = params.eventId;

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        userId,
        draft: true,
      },
    });

    if (!event) {
      return NextResponse.json({ message: "Черновик не найден или уже подтверждён" }, { status: 404 });
    }

    const draftServices = await prisma.eventService.findMany({
      where: {
        eventId,
        draft: true,
      },
    });

    if (draftServices.length === 0) {
      return NextResponse.json({ message: "Нет услуг для подтверждения" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Обновляем статус события
      await tx.event.update({
        where: { id: eventId },
        data: {
          draft: false,
          status: "confirmed",
        },
      });

      // 2. Обновляем все связанные EventService: draft = false
      await tx.eventService.updateMany({
        where: {
          eventId,
          draft: true,
        },
        data: {
          draft: false,
        },
      });

      // 3. Создаём бронирования
      const bookingsData = draftServices.map((service) => {
        if (!service.selectedStart || !service.selectedEnd) {
          throw new Error("Одна из услуг не содержит времени бронирования");
        }

        const duration = Math.floor(
          (new Date(service.selectedEnd).getTime() - new Date(service.selectedStart).getTime()) / 60000
        );

        return {
          userId,
          eventId,
          serviceId: service.serviceId,
          startTime: service.selectedStart,
          endTime: service.selectedEnd,
          durationMinutes: duration,
          status: "confirmed",
        };
      });

      await tx.booking.createMany({
        data: bookingsData,
      });
    });

    return NextResponse.json({ message: "Событие подтверждено" }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при подтверждении события:", error);
    return NextResponse.json({ message: "Ошибка на сервере" }, { status: 500 });
  }
}
