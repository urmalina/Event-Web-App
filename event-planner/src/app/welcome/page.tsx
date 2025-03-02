import React from "react";
import { Bell, Menu, Plus } from "lucide-react";

const WelcomePage = () => {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto">
      {/* Хедер */}
      <header className="flex justify-between items-center mb-4">
        <button>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold">Привет, Алина!</h1>
        <button>
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* Кнопка создания мероприятия */}
      {/* <button className="w-full bg-mustard text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 mb-4">
        <Plus className="w-5 h-5" /> Создать новое мероприятие
      </button> */}
      <button className="w-full bg-[#E1C01E] text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-4">
      <Plus className="w-5 h-5 text-black" /> Создать новое мероприятие
      </button>

      {/* Категории услуг */}
      <div className="mt-4 overflow-x-auto flex gap-3 scrollbar-hide">
        {[
          { name: "Площадки", img: "https://via.placeholder.com/60" },
          { name: "Кейтеринг", img: "https://via.placeholder.com/60" },
          { name: "Фото", img: "https://via.placeholder.com/60" },
          { name: "Ведущие", img: "https://via.placeholder.com/60" },
          { name: "Видео", img: "https://via.placeholder.com/60" },
        ].map((category, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img
              src={category.img}
              alt={category.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <span className="text-xs mt-1">{category.name}</span>
          </div>
        ))}
      </div>

      {/* Черновики мероприятий */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Черновики мероприятий</h2>
        {[
          {
            title: "Свадьба в стиле лофт",
            date: "September 5, 2024",
            services: "Выбрано 6 услуг",
            budget: "₽760,000",
          },
          {
            title: "Классическая свадьба",
            date: "August 20, 2024",
            services: "Выбрано 5 услуг",
            budget: "₽650,000",
          },
        ].map((event, idx) => (
          <div key={idx} className="bg-gray-100 p-3 rounded-lg mb-2">
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.date}</p>
            <p className="text-sm text-gray-700">{event.services}</p>
            <p className="text-sm font-semibold">Планируемый бюджет: {event.budget}</p>
          </div>
        ))}
      </section>

      {/* Подтвержденные мероприятия */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Подтвержденные мероприятия</h2>
        {[
          {
            title: "Празднование дня рождения",
            date: "July 30, 2024",
            status: "Все услуги забронированы",
            total: "₽55,000",
          },
          {
            title: "Корпоративная вечеринка",
            date: "June 15, 2024",
            status: "Частично забронировано",
            total: "₽120,000",
          },
        ].map((event, idx) => (
          <div key={idx} className="bg-gray-100 p-3 rounded-lg mb-2">
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.date}</p>
            <p className="text-sm text-gray-700">{event.status}</p>
            <p className="text-sm font-semibold">Итог: {event.total}</p>
          </div>
        ))}
      </section>

      {/* Последние обновления */}
      <section className="mt-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Последние обновления</h2>
        {[
          { text: "Банкетный зал в отеле Ритц", date: "15 июля", statusColor: "bg-[#E1C01E]" },
          { text: "Фотограф Александр Иванов", date: "15 июля 14:00-16:00", statusColor: "bg-green-500" },
        ].map((update, idx) => (
          <div key={idx} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-2">
            <div>
              <p className="text-sm">{update.text}</p>
              <p className="text-xs text-gray-500">{update.date}</p>
            </div>
            <span className={`w-3 h-3 ${update.statusColor} rounded-full`}></span>
          </div>
        ))}
      </section>
    </div>
  );
};

export default WelcomePage;
