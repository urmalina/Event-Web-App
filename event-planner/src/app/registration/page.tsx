"use client";

import React, { useState } from "react";

const RegistrationPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ORGANIZER",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setForm({ name: "", email: "", password: "", role: "ORGANIZER" });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Регистрация</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-yellow-300 focus:border-yellow-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-yellow-300 focus:border-yellow-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-yellow-300 focus:border-yellow-500"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Выберите роль:</span>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="ORGANIZER"
                  checked={form.role === "ORGANIZER"}
                  onChange={handleChange}
                  required
                  className="form-radio text-yellow-500"
                />
                <span className="ml-2">Организатор мероприятий</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="PROVIDER"
                  checked={form.role === "PROVIDER"}
                  onChange={handleChange}
                  required
                  className="form-radio text-yellow-500"
                />
                <span className="ml-2">Поставщик услуг</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-yellow-600 transition focus:outline-none focus:ring focus:ring-yellow-300"
          >
            Зарегистрироваться
          </button>
        </form>

        {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}

        <p className="text-center text-sm text-gray-600 mt-4">
          Уже есть аккаунт? <a href="#" className="text-yellow-500 hover:underline">Войти</a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
