import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 Next.js 15
) {
  try {
    const { id: serviceId } = await context.params // 👈 await обязательно

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { availability: true },
    })

    if (!service) {
      return NextResponse.json({ message: 'Услуга не найдена' }, { status: 404 })
    }

    if (!service.availability) {
      return NextResponse.json({ message: 'Нет графика доступности' }, { status: 200 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        serviceId,
        status: 'confirmed',
      },
      select: {
        startTime: true,
        endTime: true,
      },
    })

    return NextResponse.json({
      availability: service.availability,
      bookings,
    })
  } catch (error) {
    console.error('❌ Ошибка получения слотов:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
