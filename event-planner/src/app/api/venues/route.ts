// app/api/venues/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Получаем все услуги с категорией "Аренда площадки"
    const venues = await prisma.service.findMany({
      where: {
        category: 'Аренда площадки',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(venues, { status: 200 });
  } catch (error) {
    console.error('Ошибка получения площадок:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}