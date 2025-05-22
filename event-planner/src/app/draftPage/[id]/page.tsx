'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash2 } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  price?: number;
  photos: string[];
}

interface EventService {
  id: string;
  draft: boolean;
  service: {
    id: string;
    name: string;
    price?: number;
    photos?: string[];
    category: string;
  };
}

const eventTypes = [
  "Свадьба",
  "День рождения",
  "Корпоратив",
  "Вечеринка",
  "Фестиваль",
  "Выставка",
  "Презентация",
];

const DraftEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const draftId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>("");
  const [guestsCount, setGuestsCount] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [venue, setVenue] = useState<Venue | null>(null);
  const [services, setServices] = useState<EventService[]>([]);

  const fetchDraft = async () => {
    try {
      const res = await fetch(`/api/events/${draftId}`);
      const data = await res.json();
      setTitle(data.title || "");
      setType(data.type || "");
      setGuestsCount(data.guestsCount || null);
      setDate(data.date ? new Date(data.date).toISOString().split("T")[0] : "");
      setVenue(data.venue || null);
      setServices((data.services || []).filter((s: EventService) => s.draft));
    } catch (err) {
      console.error("Ошибка загрузки мероприятия:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (draftId) fetchDraft();
  }, [draftId]);

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("Пожалуйста, введите название");
      return;
    }
    setSaving(true);
    try {
      await fetch(`/api/events/${draftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          guestsCount,
          date: date ? new Date(date) : undefined,
        }),
      });
      alert("Черновик обновлён!");
    } catch (err) {
      console.error(err);
      alert("Не удалось сохранить черновик");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveVenue = async () => {
    try {
      await fetch(`/api/events/${draftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: null }),
      });
      setVenue(null);
    } catch (err) {
      console.error("Ошибка при удалении площадки", err);
    }
  };

  const handleRemove = async (eventServiceId: string) => {
    try {
      await fetch(`/api/events/${draftId}/services/${eventServiceId}`, {
        method: "DELETE",
      });
      setServices((prev) => prev.filter((s) => s.id !== eventServiceId));
    } catch (err) {
      console.error("Ошибка при удалении услуги", err);
      alert("Не удалось удалить услугу");
    }
  };

  const handleConfirm = async () => {
    try {
      const res = await fetch(`/api/events/${draftId}/confirm`, { method: "POST" });
      if (!res.ok) throw new Error("Ошибка при подтверждении");
      alert("Мероприятие подтверждено!");
      router.push("/organizer");
    } catch (err) {
      console.error("Ошибка подтверждения:", err);
      alert("Не удалось подтвердить");
    }
  };

  const totalPrice =
    (venue?.price || 0) + services.reduce((sum, s) => sum + (s.service.price || 0), 0);

  if (loading) return <p className="p-4 text-sm text-gray-500">Загрузка черновика...</p>;

  return (
    <div className="p-4 bg-white min-h-screen max-w-sm mx-auto">
      {/* Центрированный заголовок */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-semibold">Черновик</h1>
      </div>

      {/* Название */}
      <div className="my-4">
        <label htmlFor="draft-title" className="block text-sm text-gray-700 mb-1">
          Название мероприятия
        </label>
        <input
          id="draft-title"
          type="text"
          placeholder="Введите название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded border w-full"
        />
      </div>

      {/* Тип мероприятия */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {eventTypes.map((event) => (
          <Button
            key={event}
            onClick={() => setType(event)}
            className={`flex-shrink-0 ${type === event ? "bg-[#E1C01E] text-white" : "border"}`}
            variant={type === event ? "default" : "outline"}
          >
            {event}
          </Button>
        ))}
      </div>

      {/* Дата и гости */}
      <div className="space-y-4 mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="event-date" className="text-sm text-gray-700 flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" /> Дата:
          </label>
          <input
            id="event-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded border w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="guests" className="text-sm text-gray-700">
            Количество гостей:
          </label>
          <input
            id="guests"
            type="number"
            min={1}
            value={guestsCount ?? ""}
            onChange={(e) => setGuestsCount(parseInt(e.target.value))}
            className="p-2 rounded border w-full"
          />
        </div>
      </div>

      {/* Площадка */}
      <h2 className="text-lg font-semibold mt-4">Площадка мероприятия</h2>
      {venue ? (
        <Card className="mb-4 overflow-hidden p-0">
          <div className="relative">
            {venue.photos?.[0] && (
              <img src={venue.photos[0]} alt={venue.name} className="w-full h-40 object-cover" />
            )}
            <button
              onClick={handleRemoveVenue}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm"
            >
              <Trash2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          <div className="px-3 py-2">
            <h3 className="font-medium text-sm text-gray-900">{venue.name}</h3>
            <p className="text-sm text-gray-600">
              {typeof venue.price === "number" ? `${venue.price.toLocaleString()} ₽` : "Цена не указана"}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full"
              onClick={() => router.push("/hallRental")}
            >
              Изменить площадку
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          onClick={() => router.push("/hallRental")}
          className="cursor-pointer mb-4 hover:bg-gray-100 transition border border-dashed"
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded" />
            <div>
              <p className="font-medium text-gray-700">Выбрать площадку</p>
              <p className="text-sm text-gray-500">Нажмите, чтобы перейти</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Услуги */}
      <div className="flex items-center justify-between mt-6 mb-2">
        <h2 className="text-lg font-semibold">Дополнительные услуги</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-black"
          onClick={() => router.push("/serviceList")}
        >
          <span className="text-2xl leading-none">＋</span>
        </Button>
      </div>

      {services.length > 0 ? (
        <div className="space-y-3 mb-4">
          {services.map((s) => (
            <Card key={s.id} className="overflow-hidden p-0">
              <div className="relative">
                {s.service.photos?.[0] && (
                  <img
                    src={s.service.photos[0]}
                    alt={s.service.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <button
                  onClick={() => handleRemove(s.id)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm"
                >
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="px-3 py-2">
                <h3 className="font-medium text-sm text-gray-900">{s.service.name}</h3>
                <p className="text-xs text-gray-500">{s.service.category}</p>
                <p className="text-sm text-gray-800">
                  {typeof s.service.price === "number"
                    ? `${s.service.price.toLocaleString()} ₽`
                    : "Цена не указана"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card
          onClick={() => router.push("/serviceList")}
          className="cursor-pointer mb-4 hover:bg-gray-100 transition border"
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded" />
            <div>
              <p className="font-medium text-gray-700">Добавить услуги</p>
              <p className="text-sm text-gray-500">Кейтеринг, музыка, фото и т.д.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Итого и кнопки */}
      <div className="flex justify-between items-center px-2 mt-6 mb-2">
        <p className="text-sm text-gray-600">Общая стоимость</p>
        <p className="font-semibold">{totalPrice.toLocaleString()} ₽</p>
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleSaveDraft}
          className="w-full bg-gray-300 text-black hover:bg-gray-400"
          disabled={saving}
        >
          {saving ? "Сохраняем..." : "Сохранить черновик"}
        </Button>
        <Button
          className="w-full bg-gray-300 text-black hover:bg-gray-400"
          onClick={handleConfirm}
        >
          Отправить все бронирования
        </Button>
      </div>
    </div>
  );
};

export default DraftEventPage;
