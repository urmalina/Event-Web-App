import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parse } from 'cookie';

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Получаем сессию из cookie
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ message: 'Нет сессии' }, { status: 401 });
    }

    const parsed = parse(cookieHeader);
    const session = parsed.session ? JSON.parse(parsed.session) : null;

    if (!session?.userId || session.role !== 'PROVIDER') {
      return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
    }

    // 2️⃣ Получаем все услуги, размещенные этим пользователем
    const services = await prisma.service.findMany({
      where: {
        providerId: session.userId,
      },
      include: {
        availability: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('❌ Ошибка при получении своих услуг:', error);
    return NextResponse.json({ message: 'Ошибка на сервере' }, { status: 500 });
  }
}
