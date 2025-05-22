// src/app/LayoutShell.tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import SidebarMenu from "@/components/SidebarMenu";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);
  
    return (
      <div className="relative">
        {/* Бургер-кнопка */}
        <button
            onClick={toggleMenu}
            className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            aria-label="Открыть меню"
        >
            <Menu className="w-6 h-6 text-gray-700" />
        </button>

  
        {/* Меню */}
        <SidebarMenu isOpen={isMenuOpen} onClose={closeMenu} />
  
        {/* Контент */}
        <main className="max-w-md mx-auto min-h-screen px-4 py-6 overflow-y-auto font-sans">
          {children}
        </main>
      </div>
    );
  }
