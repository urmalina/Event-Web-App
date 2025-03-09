"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Сообщение об ошибке
  const router = useRouter(); // Используем для редиректа

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ Отправляем данные на сервер
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // 2️⃣ Обрабатываем ответ
    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      // 🔥 Редирект в зависимости от роли
      if (data.role === "ORGANIZER") {
        router.push("/welcome");
      } else if (data.role === "PROVIDER") {
        router.push("/welcomeService");
      } else {
        setMessage("Ошибка определения роли пользователя.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-700">
          Вход в аккаунт
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-mustard focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-mustard focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#E1C01E] p-3 text-white transition hover:bg-opacity-90"
          >
            Войти
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}

        <p className="mt-4 text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <a href="/registration" className="text-mustard hover:underline">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
}
