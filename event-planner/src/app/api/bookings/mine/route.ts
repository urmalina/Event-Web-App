import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parse } from 'cookie';

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ message: 'Нет cookie' }, { status: 401 });
    }

    const cookies = parse(cookieHeader);
    const session = cookies.session ? JSON.parse(decodeURIComponent(cookies.session)) : null;

    if (!session?.userId || session.role !== 'PROVIDER') {
      return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
    }

    const providerId = session.userId;

    // Получаем бронирования, где service принадлежит текущему пользователю
    const bookings = await prisma.booking.findMany({
      where: {
        status: 'confirmed',
        service: {
          providerId,
        },
      },
      include: {
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error('❌ Ошибка в /api/bookings/mine:', err);
    return NextResponse.json({ message: 'Ошибка на сервере' }, { status: 500 });
  }
}
