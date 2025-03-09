import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Menu } from "lucide-react";

const serviceListings = [
  { id: 1, title: "Фотограф на свадьбу", date: "15 июля", status: "active" },
  { id: 2, title: "Аренда зала для конференции", date: "20 июля", status: "active" },
];

const confirmedBookings = [
  { id: 1, title: "Фотосессия - Иванов Иван", date: "18 июля", time: "14:00-16:00", status: "confirmed" },
  { id: 2, title: "Банкетный зал - ООО \"Гранд Ивент\"", date: "22 июля", time: "18:00-22:00", status: "confirmed" },
];

export default function ProviderWelcomePage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto">
      <header className="flex justify-between items-center mb-4">
        <button>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold">Привет, Поставщик!</h1>
        <button>
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </header>
      
        <button
              //onClick={handleCreateEvent} // ✅ Добавляем обработчик клика
              className="w-full bg-[#E1C01E] text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-4 hover:bg-yellow-600 transition focus:outline-none focus:ring focus:ring-yellow-300"
            >
              <Plus className="w-5 h-5 text-black" /> Создать объявление
        </button>
      
      <h2 className="text-lg font-semibold mb-2">Ваши объявления</h2>
      {serviceListings.length ? (
        serviceListings.map((listing) => (
          <Card key={listing.id} className="bg-gray-100 p-3 rounded-lg mb-2 hover:bg-gray-200 transition duration-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.date}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-sm">Нет активных объявлений</p>
      )}

      <h2 className="text-lg font-semibold mb-2">Подтвержденные бронирования</h2>
      {confirmedBookings.length ? (
        confirmedBookings.map((booking) => (
          <Card key={booking.id} className="bg-gray-100 p-3 rounded-lg mb-2 hover:bg-gray-200 transition duration-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{booking.title}</h3>
                <p className="text-sm text-gray-500">{booking.date} {booking.time && `- ${booking.time}`}</p>
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
