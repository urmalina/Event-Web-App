import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";


export async function GET() {
  try {
    // 1️⃣ Получаем куки (сессию пользователя)
    const cookieStore = await cookies(); 
    const session = cookieStore.get("session")?.value; 

    if (!session) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    // 🔐 Безопасный парсинг сессии
    let userId: string | null = null;
    try {
      const parsed = JSON.parse(session);
      userId = parsed?.userId;
    } catch {
      return NextResponse.json({ message: "Неверный формат сессии" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ message: "Не удалось определить пользователя" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        events: {
          include: {
            services: true,
            bookings: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    const drafts = user.events.filter((event) => event.draft);
    const confirmed = user.events.filter((event) => !event.draft);

    
    return NextResponse.json({
      username: user.name,
      drafts,
      confirmed
    }, { status: 200 });

  } catch (error) {
    console.error("Ошибка загрузки данных Welcome:", error);
    return NextResponse.json({ message: "Ошибка на сервере" }, { status: 500 });
  }
}