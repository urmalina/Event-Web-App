// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Вы вышли из системы" });
  response.cookies.set("session", "", { path: "/", expires: new Date(0) }); // удаляет cookie
  return response;
}
