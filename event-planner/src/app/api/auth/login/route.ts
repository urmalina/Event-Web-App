import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
    }

    // 1️⃣ Создаём ответ
    const response = NextResponse.json({
      message: "Вы успешно вошли!",
      role: user.role,
    });

    // 2️⃣ Сохраняем защищённую session cookie
    response.cookies.set("session", JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
    }), {
      httpOnly: true, // 🔐 безопасно, не видно в JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    // 3️⃣ Сохраняем роль в отдельной cookie для UI
    response.cookies.set("role", user.role.toLowerCase(), {
      httpOnly: false, // ✅ читается в document.cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json({ message: "Ошибка на сервере" }, { status: 500 });
  }
}
