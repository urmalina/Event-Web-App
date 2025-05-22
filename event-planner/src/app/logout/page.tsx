"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        });

        // Очистка локального состояния (если используется, например: localStorage.clear())
        // localStorage.removeItem("user");
        // Перенаправляем на страницу входа
        router.push("/loginPage");
      } catch (error) {
        console.error("Ошибка при выходе:", error);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="rounded-2xl bg-white p-6 shadow-md text-center max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Выход из аккаунта...</h2>
        <p className="text-sm text-gray-500">Пожалуйста, подождите</p>
      </div>
    </div>
  );
}
