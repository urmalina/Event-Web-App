"use client";

import { useRouter } from "next/navigation";
import {
  Home,
  User,
  Calendar,
  Building2,
  Boxes,
  LogOut,
  X,
  List,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [role, setRole] = useState<"organizer" | "provider" | null>(null);

  useEffect(() => {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith("role="));

    if (raw) {
      const value = raw.split("=")[1].toLowerCase();
      setRole(value as "organizer" | "provider");
    } else {
      console.warn("⚠️ Cookie 'role' не найдена");
    }
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };
  console.log(role)
  if (role === null) return null;

  return (
    <>
     

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Меню</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <ul className="p-4 space-y-4">
          {/* Главная - перенаправление по роли */}
          <li
            onClick={() =>
              handleNavigate(role === "provider" ? "/welcomeService" : "/welcome")
            }
            className="flex items-center gap-3 cursor-pointer hover:text-yellow-600"
          >
            <Home className="w-5 h-5" /> Главная
          </li>

          <li
            onClick={() => handleNavigate("/profile")}
            className="flex items-center gap-3 cursor-pointer hover:text-yellow-600"
          >
            <User className="w-5 h-5" /> Профиль
          </li>
          <li
                onClick={() => handleNavigate("/hallRental")}
                className="flex items-center gap-3 cursor-pointer hover:text-yellow-600"
              >
                <Building2 className="w-5 h-5" /> Площадки
              </li>
              <li
                onClick={() => handleNavigate("/serviceList")}
                className="flex items-center gap-3 cursor-pointer hover:text-yellow-600"
              >
                <Boxes className="w-5 h-5" /> Услуги
              </li>

          {role === "organizer" && (
            <>
              <li
                onClick={() => handleNavigate("/bookings")}
                className="flex items-center gap-3 cursor-pointer hover:text-yellow-600"
              >
                <Calendar className="w-5 h-5" /> Мои бронирования
              </li>
              
            </>
          )}

          {role === "provider" && (
            <li
              onClick={() => handleNavigate("/myServices")}
              className="flex items-center gap-3 cursor-pointer hover:text-yellow-600"
            >
              <List className="w-5 h-5" /> Мои объявления
            </li>
          )}

          <li
            onClick={() => handleNavigate("/logout")}
            className="flex items-center gap-3 cursor-pointer text-red-600 hover:text-red-800 mt-4"
          >
            <LogOut className="w-5 h-5" /> Выйти
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarMenu;
