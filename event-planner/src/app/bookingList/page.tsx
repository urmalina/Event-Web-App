'use client';

import { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const bookings = [
  {
    id: 1,
    customerName: 'Екатерина Смирнова',
    date: '2025-04-16',
    time: '14:00 - 16:00',
    status: 'Подтверждено',
    service: 'Свадебная фотосессия',
    location: 'Центральный парк',
    guests: 50,
  },
  {
    id: 2,
    customerName: 'Михаил Андреев',
    date: '2025-04-17',
    time: '10:00 - 12:00',
    status: 'В ожидании',
    service: 'День рождения',
    location: 'Ресторан Закат',
    guests: 30,
  },
  {
    id: 3,
    customerName: 'Ольга Иванова',
    date: '2025-04-16',
    time: '18:00 - 20:00',
    status: 'В ожидании',
    service: 'Выпускной вечер',
    location: 'Загородный клуб "Берёзка"',
    guests: 20,
  }
];

export default function ProviderBookingsPage() {
  const [selectedDate, setSelectedDate] = useState('2025-04-16');
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto">
      {/* Хедер */}
      <header className="flex justify-between items-center mb-4">
        <button>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold">Бронирования</h1>
        <button>
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* Табы */}
      <div className="flex rounded-lg bg-gray-100 mb-4">
        <button
          onClick={() => setSelectedTab('upcoming')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            selectedTab === 'upcoming' ? 'bg-[#FDCB58] text-black' : 'text-gray-500'
          }`}
        >
          Предстоящие
        </button>
        <button
          onClick={() => setSelectedTab('past')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            selectedTab === 'past' ? 'bg-[#FDCB58] text-black' : 'text-gray-500'
          }`}
        >
          Прошедшие
        </button>
      </div>

      {/* Заглушка календаря */}
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700 font-medium mb-2">Апрель 2025</p>
        <div className="grid grid-cols-7 gap-2 text-sm text-center text-gray-500">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 mt-2 text-sm">
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const iso = `2025-04-${day.toString().padStart(2, '0')}`;
            const isActive = bookings.some((b) => b.date === iso);
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(iso)}
                className={`rounded-full w-8 h-8 text-center ${
                  selectedDate === iso
                    ? 'bg-[#FDCB58] text-black'
                    : isActive
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-500'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Список бронирований */}
      {bookings
        .filter((b) => b.date === selectedDate)
        .map((booking) => (
          <div key={booking.id} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-sm">{booking.customerName}</h3>
                <p className="text-sm text-gray-600">{booking.service}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  booking.status === 'Подтверждено'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                {booking.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1 mb-3">
              <p>📅 {booking.date}</p>
              <p>⏰ {booking.time}</p>
              <p>📍 {booking.location}</p>
              <p>👥 {booking.guests} гостей</p>
            </div>

            <div className="flex gap-2">
              {booking.status === 'В ожидании' ? (
                <>
                  <Button className="flex-1 border border-green-600 text-green-600 bg-white hover:bg-green-50">
                    Подтвердить
                  </Button>
                  <Button className="flex-1 border border-red-600 text-red-600 bg-white hover:bg-red-50">
                    Отклонить
                  </Button>
                </>
              ) : (
                <>
                  <Button className="flex-1 border border-yellow-600 text-yellow-600 bg-white hover:bg-yellow-50">
                    Изменить
                  </Button>
                  <Button className="flex-1 border border-red-600 text-red-600 bg-white hover:bg-red-50">
                    Отменить
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
