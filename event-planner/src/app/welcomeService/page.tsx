'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  createdAt: string;
  photos?: string[]; // 📸 добавлено для отображения изображения
}

interface Booking {
  id: string;
  service: {
    name: string;
  };
  startTime: string;
  endTime: string;
}

export default function ProviderWelcomePage() {
  const router = useRouter();
  const [providerName, setProviderName] = useState('Поставщик');
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/welcome');
        const userData = await userRes.json();
        if (userData.username) setProviderName(userData.username);

        const serviceRes = await fetch('/api/services/mine');
        const serviceData = await serviceRes.json();
        setServices(serviceData);

        const bookingRes = await fetch('/api/bookings/mine');
        const bookingData = await bookingRes.json();
        setBookings(bookingData);
      } catch (err) {
        console.error('Ошибка загрузки данных поставщика:', err);
      }
    };

    fetchData();
  }, []);

  const handleCreateClick = () => {
    router.push('/addServicePage');
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto">
      <header className="flex justify-between items-center mb-4">
        <div />
        <h1 className="text-xl font-semibold">Привет, {providerName}!</h1>
        <button>
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      <button
        onClick={handleCreateClick}
        className="w-full bg-[#E1C01E] text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-4 hover:bg-yellow-600 transition focus:outline-none focus:ring focus:ring-yellow-300"
      >
        <Plus className="w-5 h-5 text-black" /> Создать объявление
      </button>

      <h2 className="text-lg font-semibold mb-2">Ваши объявления</h2>
      {services.length ? (
        services.map((s) => (
          <Card
            key={s.id}
            onClick={() => router.push(`/services/${s.id}`)}
            className="rounded-lg mb-2 hover:bg-gray-100 transition duration-200 cursor-pointer p-0 shadow-sm border"
          >
            <CardContent className="flex items-center gap-3 p-2">
              {s.photos?.[0] ? (
                <img
                  src={s.photos[0]}
                  alt={s.name}
                  className="w-20 h-20 rounded-md object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                  нет фото
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">{s.name}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(s.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
            </CardContent>
          </Card>

        ))
      ) : (
        <p className="text-gray-500 text-sm">Нет активных объявлений</p>
      )}

      <h2 className="text-lg font-semibold mb-2">Подтвержденные бронирования</h2>
      {bookings.length ? (
        bookings.map((b) => (
          <Card
            key={b.id}
            className="bg-gray-100 p-3 rounded-lg mb-2 hover:bg-gray-200 transition duration-200"
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{b.service.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(b.startTime).toLocaleDateString('ru-RU')} –{' '}
                  {new Date(b.startTime).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  –{new Date(b.endTime).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-sm">Нет подтвержденных бронирований</p>
      )}
    </div>
  );
}
