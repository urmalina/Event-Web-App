'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';

export default function MyServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyServices() {
      try {
        const res = await fetch('/api/services/mine'); // предполагается, что API возвращает только услуги текущего пользователя
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Ошибка при загрузке');
        setServices(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMyServices();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto">
      <h1 className="text-xl font-semibold mb-4">Мои объявления</h1>

      {loading && <p className="text-sm text-gray-500">Загрузка...</p>}
      {error && <p className="text-sm text-red-500">Ошибка: {error}</p>}

      {services.length === 0 && !loading && (
        <p className="text-sm text-gray-600">У вас пока нет размещённых услуг.</p>
      )}

      <div className="space-y-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="overflow-hidden cursor-pointer"
            onClick={() => router.push(`/services/${service.id}`)}
          >
            <img
              src={service.photos?.[0] || '/images/default.png'}
              alt={service.name}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4 space-y-1">
              <h3 className="font-semibold text-base">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.city}</p>
              <p className="text-sm font-medium">от ₽{service.price.toLocaleString()}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-green-600 text-sm font-medium">Опубликовано</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/services/${service.id}`);
                  }}
                >
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
