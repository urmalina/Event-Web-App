import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    // 2️⃣ Проверяем пароль
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
    }

    // 3️⃣ Создаём ответ
    const response = NextResponse.json({ 
      message: "Вы успешно вошли!", 
      role: user.role // 🔥 Отправляем роль пользователя
    }, { status: 200 });

    // 4️⃣ Устанавливаем куки через response.cookies.set()
    response.cookies.set("session", JSON.stringify({ userId: user.id, email: user.email, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 день
    });

    return response;

  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json({ message: "Ошибка на сервере" }, { status: 500 });
  }
}
