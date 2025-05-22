'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, Plus } from "lucide-react";
import SidebarMenu from "@/components/SidebarMenu";

interface Event {
  id: string;
  title: string | null;
  date: string | null;
  draft: boolean;
  venue?: {
    name: string;
    photos: string[];
  } | null;
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
  const [draftEvents, setDraftEvents] = useState<Event[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    // Основные данные пользователя
    fetch("/api/welcome")
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
        setDrafts(data.drafts || []);
        setConfirmed(data.confirmed || []);
        setUpdates(data.updates || []);
      })
      .catch((error) => console.error("Ошибка загрузки данных:", error));

    // Загрузка черновиков из новой модели
    fetch("/api/events?draft=true")
      .then((res) => res.json())
      .then((data) => {
        setDraftEvents(data || []);
      })
      .catch((err) => console.error("Ошибка загрузки черновиков из базы:", err));
  }, []);

  const handleCreateEvent = () => {
    router.push("/draftPage");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto relative">
      {/* Хедер */}
      <header className="flex justify-center items-center mb-4">
        <h1 className="text-xl font-semibold">Привет, {username}!</h1>
      </header>

      {/* Кнопка создания мероприятия */}
      <button
        onClick={handleCreateEvent}
        className="w-full bg-[#FDCB58] text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-4 hover:bg-yellow-500 transition focus:outline-none focus:ring focus:ring-yellow-300"
      >
        <Plus className="w-5 h-5" /> Создать новое мероприятие
      </button>

      {/* Категории услуг */}
      <div className="mb-4 overflow-x-auto flex gap-4 scrollbar-hide">
        {[
          { name: "Площадки", route: "/hallRental", img: "/images/categories/hall.png" },
          { name: "Кейтеринг", route: "/catering", img: "/images/categories/catering.png" },
          { name: "Фото", route: "/photography", img: "/images/categories/photo.png" },
          { name: "Ведущие", route: "/hosts", img: "/images/categories/hosts.png" },
          { name: "Видео", route: "/videography", img: "/images/categories/video.png" },
        ].map((cat) => (
          <div key={cat.name} className="flex flex-col items-center min-w-[64px]">
            <button
              onClick={() => router.push(cat.route)}
              className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </button>
            <span className="text-xs text-center mt-1">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Черновики */}
      <section className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Ваши черновики</h2>
        {draftEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">Нет сохранённых черновиков</p>
        ) : (
          draftEvents.map((draft) => (
            <div
              key={draft.id}
              onClick={() => router.push(`/draftPage/${draft.id}`)}
              className="bg-gray-100 p-3 rounded-lg mb-2 hover:bg-gray-200 transition duration-200 cursor-pointer flex items-center gap-3"
            >
              {draft.venue?.photos?.[0] && (
                <img
                  src={draft.venue.photos[0]}
                  alt={draft.venue.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
              )}
              <div>
                <h3 className="font-medium">{draft.title || "Без названия"}</h3>
                {draft.date && (
                  <p className="text-sm text-gray-500">
                    Дата: {new Date(draft.date).toLocaleDateString("ru-RU")}
                  </p>
                )}
              </div>
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
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-2"
            >
              <div>
                <p className="text-sm">{update.text}</p>
                <p className="text-xs text-gray-500">{update.date}</p>
              </div>
              <span className={`w-3 h-3 ${update.statusColor} rounded-full`}></span>
            </div>
          ))
        )}
      </section>

      <SidebarMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
}
