import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    // Проверяем роль пользователя
    if (!["ORGANIZER", "PROVIDER"].includes(role)) {
      return NextResponse.json({ message: "Недопустимая роль" }, { status: 400 });
    }

    // Проверяем, существует ли email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email уже используется" }, { status: 400 });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    return NextResponse.json({ message: "Пользователь зарегистрирован", user }, { status: 201 });

  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json({ message: "Ошибка на сервере" }, { status: 500 });
  }
}
