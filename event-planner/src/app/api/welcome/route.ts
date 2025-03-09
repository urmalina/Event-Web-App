import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1️⃣ Получаем куки (сессию пользователя)
    const cookieStore = await cookies(); // ✅ Добавляем await
    const session = cookieStore.get("session")?.value; 

    if (!session) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    // 2️⃣ Парсим данные сессии
    const { userId } = JSON.parse(session);

    // 3️⃣ Получаем данные о пользователе
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        events: {
          orderBy: { date: "asc" }, // Сортируем по дате
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    // 4️⃣ Формируем ответ
    const response = {
      username: user.name,
      drafts: user.events.filter((event) => event.status === "draft"),
      confirmed: user.events.filter((event) => event.status === "confirmed"),
      updates: [
        { text: "Банкетный зал в отеле Ритц", date: "15 июля", statusColor: "bg-[#E1C01E]" },
        { text: "Фотограф Александр Иванов", date: "15 июля 14:00-16:00", statusColor: "bg-green-500" },
      ],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Ошибка загрузки данных Welcome:", error);
    return NextResponse.json({ message: "Ошибка на сервере" }, { status: 500 });
  }
}
