import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parse } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      category,
      city,
      location,
      price,
      priceType,
      availabilityDays,
      availabilityStartTime,
      availabilityEndTime,
      capacity,
      venueType,
      experience,
      workFormats,
      photos = [],
    } = body;

    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ message: 'Нет сессии' }, { status: 401 });
    }

    const parsed = parse(cookieHeader);
    const session = parsed.session ? JSON.parse(parsed.session) : null;
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ message: 'Неавторизован' }, { status: 401 });
    }

    if (!name || !description || !category || !city || !price || !priceType) {
      return NextResponse.json({ message: 'Заполнены не все обязательные поля' }, { status: 400 });
    }

    let availability = null;
    if (availabilityDays && availabilityStartTime && availabilityEndTime) {
      availability = await prisma.availabilitySchedule.create({
        data: {
          days: availabilityDays,
          startTime: availabilityStartTime,
          endTime: availabilityEndTime,
        },
      });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        category,
        city,
        location,
        price: Number(price),
        priceType,
        photos,
        availabilityId: availability?.id || null,
        capacity: capacity ? Number(capacity) : null,
        venueType: venueType || null,
        experience: experience ? Number(experience) : null,
        workFormats,
        providerId: userId,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('❌ Ошибка при создании услуги:', error);
    return NextResponse.json({ message: 'Ошибка на сервере' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: {
        category: {
          not: 'Аренда площадки', // ⛔ исключаем "Аренда площадки"
        },
      },
      include: {
        availability: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении списка услуг:', error);
    return NextResponse.json(
      { message: 'Ошибка при загрузке списка услуг' },
      { status: 500 }
    );
  }
}

