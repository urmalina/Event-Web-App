'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const categories = ['Аренда площадки', 'Фотограф', 'Кейтеринг', 'Музыка', 'Ведущий', 'Декор'];
const venueTypes = ['Банкетный зал', 'Шатёр', 'Беседка', 'Конференц-зал', 'Арт пространство', 'Игровая комната', 'Концертный зал', 'Лофт'];
const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function AddServicePage() {
  const { register, handleSubmit, watch, reset } = useForm();
  const category = watch('category');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages((prev) => [...prev, ...fileArray]);
    }
  };

  const onSubmit = async (rawData: any) => {
    setIsSubmitting(true);
    setSuccess(false);
    setError(null);
  
    try {
      // 🔼 Загружаем фото по одному
      const uploadedPhotoUrls: string[] = [];
  
      for (const file of selectedImages) {
        const formData = new FormData();
        formData.append("image", file);
  
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
  
        const uploadResult = await uploadRes.json();
        if (uploadRes.ok && uploadResult.url) {
          uploadedPhotoUrls.push(uploadResult.url);
        } else {
          throw new Error("Ошибка при загрузке изображения");
        }
      }
  
      // 🧩 Формируем расписание доступности
      const availability = {
        days: Array.isArray(rawData.availabilityDays)
          ? rawData.availabilityDays
          : [rawData.availabilityDays].filter(Boolean),
        startTime: rawData.availabilityStartTime,
        endTime: rawData.availabilityEndTime,
      };
  
      // 🧾 Формируем финальные данные
      const serviceData = {
        name: rawData.name,
        description: rawData.description,
        category: rawData.category,
        city: rawData.city,
        location: rawData.location,
        price: parseInt(rawData.price),
        priceType: rawData.priceType,
        capacity: rawData.capacity ? parseInt(rawData.capacity) : null,
        venueType: rawData.venueType || null,
        experience: rawData.experience ? parseInt(rawData.experience) : null,
        workFormats: Array.isArray(rawData.workFormats)
          ? rawData.workFormats
          : [rawData.workFormats].filter(Boolean),
        photos: uploadedPhotoUrls,
        availability,
      };
  
      // 📬 Отправка услуги в базу
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });
  
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Ошибка при создании услуги");
      }
  
      setSuccess(true);
      reset();
      setSelectedImages([]);
      router.push("/welcomeService");
  
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Произошла ошибка");
    } finally {
      setIsSubmitting(false);
    }
  };
 

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 pb-36 overflow-y-auto">
      <h1 className="text-xl font-semibold mb-4">Добавить новую услугу</h1>

      <form id="add-service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <input {...register('name')} placeholder="Название услуги"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm" required />

            <textarea {...register('description')} placeholder="Описание"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none" rows={4} required />

            <input type="file" multiple accept="image/*" onChange={handleImageChange}
              className="w-full text-sm text-gray-600" />

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selectedImages.map((file, idx) => (
                  <div key={idx} className="relative w-full h-24 overflow-hidden rounded-md border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`photo-${idx}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}

            <select {...register('category')} className="w-full border rounded-lg p-3 bg-white text-sm" required>
              <option value="">Категория</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <input {...register('city')} placeholder="Город"
              className="w-full border rounded-lg p-3 text-sm" required />

            <input {...register('location')} placeholder="Точное местоположение (необязательно)"
              className="w-full border rounded-lg p-3 text-sm" />

            <div className="flex gap-2">
              <input type="number" {...register('price')} placeholder="Стоимость"
                className="w-full border rounded-lg p-3 text-sm" required />
              <select {...register('priceType')} className="w-32 border rounded-lg p-3 bg-white text-sm" required>
                <option value="DAY">за день</option>
                <option value="HOUR">за час</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Доступные дни</label>
              <div className="grid grid-cols-3 gap-2">
                {weekdays.map((day) => (
                  <label key={day} className="flex items-center gap-1 text-sm">
                    <input type="checkbox" value={day} {...register('availabilityDays')} />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input type="time" {...register('availabilityStartTime')}
                className="w-full border rounded-lg p-3 text-sm" required />
              <input type="time" {...register('availabilityEndTime')}
                className="w-full border rounded-lg p-3 text-sm" required />
            </div>

            {category === 'Аренда площадки' && (
              <>
                <input type="number" {...register('capacity')} placeholder="Вместимость"
                  className="w-full border rounded-lg p-3 text-sm" />
                <select {...register('venueType')} className="w-full border rounded-lg p-3 bg-white text-sm">
                  <option value="">Тип площадки</option>
                  {venueTypes.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </>
            )}

            {category === 'Фотограф' && (
              <>
                <input type="number" {...register('experience')} placeholder="Опыт (лет)"
                  className="w-full border rounded-lg p-3 text-sm" />
                <div>
                  <label className="block text-sm font-medium mb-1">Форматы работы</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['по часу', 'пакет услуг', 'весь день'].map((f) => (
                      <label key={f} className="flex items-center gap-1 text-sm">
                        <input type="checkbox" value={f} {...register('workFormats')} />
                        {f}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {success && <p className="text-green-600 text-sm text-center">✅ Услуга успешно опубликована!</p>}
        {error && <p className="text-red-600 text-sm text-center">❌ {error}</p>}

        <div className="h-24" />
      </form>

      {/* Фиксированная кнопка */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4">
        <div className="max-w-md mx-auto px-4">
          <Button
            type="submit"
            form="add-service-form"
            disabled={isSubmitting}
            className="w-full bg-[#E1C01E] hover:bg-yellow-600 text-black font-semibold py-3 text-sm rounded-lg"
          >
            {isSubmitting ? 'Сохраняем...' : 'Опубликовать услугу'}
          </Button>
        </div>
      </div>
    </div>
  );
}
