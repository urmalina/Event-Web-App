'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

const categories = ['Аренда площадки', 'Фотограф', 'Кейтеринг', 'Музыка', 'Ведущий', 'Декор'];
const venueTypes = ['Банкетный зал', 'Шатёр', 'Беседка'];
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

type FormData = {
  name: string;
  description: string;
  photos: FileList;
  category: string;
  price: number;
  priceType: 'DAY' | 'HOUR';
  city: string;
  location?: string;
  availabilityDays: string[];
  availabilityStartTime: string;
  availabilityEndTime: string;
  capacity?: number;
  venueType?: string;
  experience?: number;
  workFormats?: string[];
};

export default function ServiceForm() {
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const category = watch('category');

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    for (const key in data) {
      const value = data[key as keyof FormData];
      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append('photos', file);
        });
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Ошибка при отправке');

      alert('Услуга успешно добавлена!');
    } catch (error) {
      alert('Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto pt-4 pb-36 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
        <input {...register('name')} placeholder="Название услуги"
          className="w-full border border-gray-300 rounded-xl p-3" required />

        <textarea {...register('description')} placeholder="Описание"
          className="w-full border border-gray-300 rounded-xl p-3 resize-none" rows={4} required />

        <input type="file" multiple accept="image/*" {...register('photos')}
          className="w-full text-gray-600" />

        <select {...register('category')} className="w-full border rounded-xl p-3 bg-white" required>
          <option value="">Категория</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <input {...register('city')} placeholder="Город"
          className="w-full border rounded-xl p-3" required />

        <input {...register('location')} placeholder="Точное местоположение (необязательно)"
          className="w-full border rounded-xl p-3" />

        <div className="flex gap-2">
          <input type="number" {...register('price', { valueAsNumber: true })}
            placeholder="Стоимость" className="w-full border rounded-xl p-3" required />
          <select {...register('priceType')} className="w-28 border rounded-xl p-3 bg-white">
            <option value="DAY">за день</option>
            <option value="HOUR">за час</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Доступные дни</label>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {weekdays.map((day) => (
              <label key={day} className="flex items-center gap-1">
                <input type="checkbox" value={day} {...register('availabilityDays')} />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input type="time" {...register('availabilityStartTime')} className="w-full border rounded-xl p-3" required />
          <input type="time" {...register('availabilityEndTime')} className="w-full border rounded-xl p-3" required />
        </div>

        {/* Показать доп. поля по категориям */}
        {category === 'Аренда площадки' && (
          <>
            <input type="number" {...register('capacity')} placeholder="Вместимость"
              className="w-full border rounded-xl p-3" />
            <select {...register('venueType')} className="w-full border rounded-xl p-3 bg-white">
              <option value="">Тип площадки</option>
              {venueTypes.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </>
        )}

        {category === 'Фотограф' && (
          <>
            <input type="number" {...register('experience')} placeholder="Опыт (лет)"
              className="w-full border rounded-xl p-3" />
            <div>
              <label className="block font-medium mb-1">Форматы работы</label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {['по часу', 'пакет услуг', 'весь день'].map((f) => (
                  <label key={f} className="flex items-center gap-1">
                    <input type="checkbox" value={f} {...register('workFormats')} />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </form>

      {/* Кнопка снизу */}
      <div className="fixed bottom-4 left-0 right-0 px-4">
        <button type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-yellow-600 transition">
          {isSubmitting ? 'Сохраняем...' : 'Опубликовать услугу'}
        </button>
      </div>
    </div>
  );
}
