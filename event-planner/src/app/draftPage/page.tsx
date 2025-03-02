import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

const DraftEventPage = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen max-w-sm mx-auto">
      {/* Навигация */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <button className="text-xl">☰</button>
        <h1 className="text-lg font-semibold">Черновик</h1>
        <button className="text-xl">🔔</button>
      </header>
      
      {/* Выбор типа мероприятия */}
      <div className="flex space-x-2 my-4 overflow-x-auto">
        <Button className="bg-[#E1C01E] text-white flex-shrink-0">Свадьба</Button>
        <Button variant="outline" className="flex-shrink-0">День рождения</Button>
        <Button variant="outline" className="flex-shrink-0">Корпоратив</Button>
      </div>
      
      {/* Выбор даты и количества гостей */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        <Button variant="outline" className="flex items-center space-x-2 flex-shrink-0">
          <CalendarIcon className="w-4 h-4" />
          <span>Выберите дату</span>
        </Button>
        <Button variant="outline" className="flex-shrink-0">Количество гостей</Button>
      </div>
      
      {/* Рекомендуемые шаблоны */}
      <h2 className="text-lg font-semibold mb-2">Рекомендуемые шаблоны</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <Card className="border-mustard border-2 flex-shrink-0 w-64 hover:bg-gray-200 transition duration-200 cursor-pointer">
          <CardContent className="p-4">
            <img src="/images/wedding.jpg" alt="Классическая свадьба" className="rounded-lg mb-2 w-full" />
            <h3 className="font-semibold">Классическая свадьба</h3>
            <p>Место + Кейтеринг + Фото</p>
            <p className="text-mustard font-bold">От 549 900 ₽</p>
          </CardContent>
        </Card>
        <Card className="border-gray-300 border-2 flex-shrink-0 w-64 hover:bg-gray-200 transition duration-200 cursor-pointer">
          <CardContent className="p-4">
            <img src="/images/birthday.png" alt="День рождения" className="rounded-lg mb-2 w-full" />
            <h3 className="font-semibold">День рождения</h3>
            <p>Место + Аниматор + Фото</p>
            <p className="text-gray-600 font-bold">От 299 000 ₽</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Дополнительные услуги */}
      <h2 className="text-lg font-semibold mt-4">Дополнительные услуги</h2>
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        <Button variant="outline" className="flex-shrink-0">🍽 Кейтеринг</Button>
        <Button variant="outline" className="flex-shrink-0">🎵 Музыка</Button>
        <Button variant="outline" className="flex-shrink-0">🚗 Транспорт</Button>
        <Button variant="outline" className="flex-shrink-0">➕ Ещё</Button>
      </div>
      
      {/* Выбранные услуги */}
      <h2 className="text-lg font-semibold">Выбранные услуги</h2>
      <Card className="mb-2 hover:bg-gray-200 transition duration-200 cursor-pointer">
        <CardContent>
          <h3 className="font-semibold">Банкетный зал в отеле Ритц</h3>
          <p>Место • 15 июля 2024</p>
          <p className="font-bold">321 000 ₽</p>
        </CardContent>
      </Card>
      <Card className="mb-2 hover:bg-gray-200 transition duration-200 cursor-pointer">
        <CardContent>
          <h3 className="font-semibold">Александр Иванов</h3>
          <p>Фотограф • 6 часов</p>
          <p className="font-bold">110 000 ₽</p>
        </CardContent>
      </Card>
      
      {/* Итоговая стоимость */}
      <div className="mt-4 text-lg font-semibold">Общая стоимость: 660 500 ₽</div>
      
      {/* Кнопка отправки */}
      <Button className="w-full bg-[#E1C01E] text-white mt-4">Отправить бронирования</Button>
    </div>
  );
};

export default DraftEventPage;
