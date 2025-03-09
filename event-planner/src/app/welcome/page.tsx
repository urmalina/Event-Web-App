"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Импортируем useRouter
import { Bell, Menu, Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  services: string;
  budget: string;
}

interface Update {
  text: string;
  date: string;
  statusColor: string;
}

export default function WelcomePage() {
  const [username, setUsername] = useState("Пользователь");
  const [drafts, setDrafts] = useState<Event[]>([]);
  const [confirmed, setConfirmed] = useState<Event[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const router = useRouter(); // ✅ Создаём объект для навигации

  useEffect(() => {
    // 1️⃣ Загружаем данные с API
    fetch("/api/welcome")
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
        setDrafts(data.drafts || []);
        setConfirmed(data.confirmed || []);
        setUpdates(data.updates || []);
      })
      .catch((error) => console.error("Ошибка загрузки данных:", error));
  }, []);

  // 2️⃣ Функция для редиректа на страницу черновика
  const handleCreateEvent = () => {
    router.push("/draftPage"); // 🔥 Редирект на draftPage
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto">
      {/* Хедер */}
      <header className="flex justify-between items-center mb-4">
        <button>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold">Привет, {username}!</h1>
        <button>
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* Кнопка создания мероприятия */}
      <button
        onClick={handleCreateEvent} // ✅ Добавляем обработчик клика
        className="w-full bg-[#E1C01E] text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-4 hover:bg-yellow-600 transition focus:outline-none focus:ring focus:ring-yellow-300"
      >
        <Plus className="w-5 h-5 text-black" /> Создать новое мероприятие
      </button>

      {/* Черновики мероприятий */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Черновики мероприятий</h2>
        {drafts.length === 0 ? (
          <p className="text-gray-500 text-sm">Нет черновиков</p>
        ) : (
          drafts.map((event) => (
            <div key={event.id} className="bg-gray-100 p-3 rounded-lg mb-2">
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="text-sm text-gray-700">{event.services}</p>
              <p className="text-sm font-semibold">Планируемый бюджет: {event.budget}</p>
            </div>
          ))
        )}
      </section>

      {/* Подтвержденные мероприятия */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Подтвержденные мероприятия</h2>
        {confirmed.length === 0 ? (
          <p className="text-gray-500 text-sm">Нет подтвержденных мероприятий</p>
        ) : (
          confirmed.map((event) => (
            <div key={event.id} className="bg-gray-100 p-3 rounded-lg mb-2">
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="text-sm text-gray-700">{event.services}</p>
              <p className="text-sm font-semibold">Итог: {event.budget}</p>
            </div>
          ))
        )}
      </section>

      {/* Последние обновления */}
      <section className="mt-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Последние обновления</h2>
        {updates.length === 0 ? (
          <p className="text-gray-500 text-sm">Нет обновлений</p>
        ) : (
          updates.map((update, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-2">
              <div>
                <p className="text-sm">{update.text}</p>
                <p className="text-xs text-gray-500">{update.date}</p>
              </div>
              <span className={`w-3 h-3 ${update.statusColor} rounded-full`}></span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
