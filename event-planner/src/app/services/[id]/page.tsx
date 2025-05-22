'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<'organizer' | 'provider' | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [showDraftSelect, setShowDraftSelect] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  useEffect(() => {
    const cookie = document.cookie.split('; ').find((c) => c.startsWith('role='));
    if (cookie) {
      const value = cookie.split('=')[1];
      setRole(value as 'organizer' | 'provider');
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Ошибка загрузки услуги');
        setService(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    const fetchSlots = async () => {
      try {
        const res = await fetch(`/api/services/${id}/slots`);
        const data = await res.json();
        setSlots(data);
      } catch (err) {
        console.error('Ошибка загрузки слотов:', err);
      }
    };

    fetchService();
    fetchSlots();
  }, [id]);

  const fetchDrafts = async () => {
    try {
      const res = await fetch('/api/events?draft=true');
      const data = await res.json();
      setDrafts(data);
      setShowDraftSelect(true);
    } catch (err) {
      console.error('Ошибка загрузки черновиков');
    }
  };

  const handleAddToDraft = async () => {
    if (!selectedDraftId || !service?.id) return;
  
    try {
      if (service.category === 'Аренда площадки') {
        // ✅ Добавляем как venue
        const res = await fetch(`/api/events/${selectedDraftId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ venueId: service.id }),
        });
  
        if (!res.ok) throw new Error("Не удалось добавить площадку");
  
        alert("Площадка успешно добавлена");
      } else {
        // ✅ Обычная услуга → POST в EventService
        const body: any = { serviceId: service.id };
        if (service.priceType === "HOUR" && selectedSlotId) {
          body.slotId = selectedSlotId;
        }
  
        const res = await fetch(`/api/events/${selectedDraftId}/services`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
  
        if (!res.ok) throw new Error("Не удалось добавить услугу");
        alert("Услуга добавлена");
      }
  
      setShowDraftSelect(false);
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
      alert("Произошла ошибка");
    }
  };
  
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!service) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto">
      {/* Изображение и миниатюры */}
      <div className="mb-4">
        <img
          src={service.photos?.[activeImg]}
          alt={`Фото ${activeImg + 1}`}
          className="w-full h-52 object-cover rounded-lg"
        />
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {service.photos?.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              onClick={() => setActiveImg(idx)}
              className={`w-20 h-14 object-cover rounded-md border cursor-pointer ${activeImg === idx ? 'border-yellow-500' : 'border-gray-300'}`}
            />
          ))}
        </div>
      </div>

      {/* Информация об услуге */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h1 className="text-lg font-semibold">{service.name}</h1>
          <p className="text-sm text-gray-600">{service.description}</p>
          <div className="text-sm text-gray-700 space-y-1 pt-2">
            <p>📍 Город: {service.city}</p>
            {service.location && <p>📌 Локация: {service.location}</p>}
            <p>🏷 Категория: {service.category}</p>
            {service.capacity && <p>👥 Вместимость: {service.capacity}</p>}
            {service.venueType && <p>🏛 Тип площадки: {service.venueType}</p>}
            <p>
              💰 Стоимость: ₽{service.price.toLocaleString()} ({service.priceType === 'DAY' ? 'за день' : 'за час'})
            </p>
            {service.availability && (
              <>
                <p>🕒 Доступность: {service.availability.startTime} – {service.availability.endTime}</p>
                <p>📆 Дни: {service.availability.days?.join(', ')}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Слоты */}
      {slots.length > 0 && service.priceType === 'HOUR' && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Свободное время:</h3>
          <div className="space-y-2">
            {slots.map((slot) => (
              <div key={slot.id} className={`p-2 border rounded ${selectedSlotId === slot.id ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-50'}`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">
                    {new Date(slot.date).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {slot.endDate && (
                      ` – ${new Date(slot.endDate).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    )}
                  </span>
                  <input
                    type="radio"
                    name="slot"
                    checked={selectedSlotId === slot.id}
                    onChange={() => setSelectedSlotId(slot.id)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Добавление в черновик */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4">
        <div className="max-w-md mx-auto px-4 flex flex-col gap-2">
          {role === 'organizer' && (
            <>
              <Button
                onClick={fetchDrafts}
                className="w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 text-sm rounded-lg"
              >
                Добавить в черновик
              </Button>

              {showDraftSelect && (
                <div className="mt-2 border rounded-lg p-3 space-y-2 bg-gray-100">
                  <label className="text-sm font-medium">Выберите черновик:</label>
                  <select
                    className="w-full border rounded-md p-2 text-sm"
                    value={selectedDraftId || ''}
                    onChange={(e) => setSelectedDraftId(e.target.value)}
                  >
                    <option value="">Выберите черновик...</option>
                    {drafts.map((d) => {
                      const formattedDate = d.date
                        ? new Date(d.date).toLocaleDateString('ru-RU')
                        : 'Без даты';
                      return (
                        <option key={d.id} value={d.id}>
                          {d.title || 'Без названия'} – {formattedDate}
                        </option>
                      );
                    })}
                  </select>

                  <Button
                    onClick={handleAddToDraft}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 text-sm rounded-lg"
                  >
                    Добавить
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
