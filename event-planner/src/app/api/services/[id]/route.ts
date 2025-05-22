import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parse } from 'cookie';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Получаем userId из httpOnly cookie
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const session = cookies.session ? JSON.parse(decodeURIComponent(cookies.session)) : null;
    const currentUserId = session?.userId;

    // Ищем услугу
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        availability: true,
      },
    });

    if (!service) {
      return NextResponse.json({ message: 'Услуга не найдена' }, { status: 404 });
    }

    // Проверяем, владелец ли текущий пользователь
    const isOwner = currentUserId && currentUserId === service.providerId;

    return NextResponse.json({ ...service, isOwner }, { status: 200 });
  } catch (error) {
    console.error('Ошибка получения услуги:', error);
    return NextResponse.json({ message: 'Ошибка на сервере' }, { status: 500 });
  }
}
