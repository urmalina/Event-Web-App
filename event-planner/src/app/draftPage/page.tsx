'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

const eventTypes = [
  "Свадьба",
  "День рождения",
  "Корпоратив",
  "Вечеринка",
  "Фестиваль",
  "Выставка",
  "Презентация",
];

const CreateDraftPage = () => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Свадьба");
  const [guestsCount, setGuestsCount] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("Пожалуйста, введите название мероприятия");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          guestsCount: guestsCount ?? undefined,
          date: date ? new Date(date) : undefined,
        }),
      });

      if (!res.ok) throw new Error("Ошибка при создании черновика");

      const draft = await res.json();
      alert("Черновик создан!");
      router.push(`/draftPage/${draft.id}`);
    } catch (err) {
      console.error(err);
      alert("Не удалось создать черновик");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen max-w-sm mx-auto">
      {/* Заголовок */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-lg font-semibold">Новый черновик</h1>
        <button className="text-xl">🔔</button>
      </header>

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

      {/* Площадка мероприятия */}
      <h2 className="text-lg font-semibold mt-6">Площадка мероприятия</h2>
      <Card
        onClick={() => alert("Вы сможете выбрать площадку после создания черновика")}
        className="cursor-not-allowed mb-4 bg-gray-200 border-dashed border text-gray-500"
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded" />
          <div>
            <p className="font-medium">Выбрать площадку</p>
            <p className="text-sm">Доступно после создания</p>
          </div>
        </CardContent>
      </Card>

      {/* Дополнительные услуги */}
      <div className="flex items-center justify-between mt-6 mb-2">
        <h2 className="text-lg font-semibold">Дополнительные услуги</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 cursor-not-allowed"
          onClick={() => alert("Добавление услуг доступно после создания черновика")}
        >
          <span className="text-2xl leading-none">＋</span>
        </Button>
      </div>

      {/* Общая стоимость и кнопки */}
      <div className="flex justify-between items-center px-2 mt-6 mb-2">
        <p className="text-sm text-gray-600">Общая стоимость</p>
        <p className="font-semibold text-gray-800">0 ₽</p>
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleSaveDraft}
          className="w-full bg-[#E1C01E] text-white"
          disabled={saving}
        >
          {saving ? "Создаём..." : "Создать черновик"}
        </Button>
      </div>
    </div>
  );
};

export default CreateDraftPage;
