import { parse } from "cookie";
import { NextRequest } from "next/server";

export function getUserFromRequest(req: NextRequest): { userId: string; role: string } | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  const sessionRaw = cookies.session;
  if (!sessionRaw) return null;

  try {
    const session = JSON.parse(decodeURIComponent(sessionRaw));
    return {
      userId: session.userId,
      role: session.role,
    };
  } catch (e) {
    console.error("Не удалось распарсить session cookie:", e);
    return null;
  }
}
