'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const serviceFilters = ['Все', 'Фотограф', 'Кейтеринг', 'Музыка', 'Ведущий', 'Декор'];

export default function ServiceListPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Все');
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Ошибка при загрузке данных');
        setServices(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesFilter = selectedFilter === 'Все' || service.category === selectedFilter;
    const matchesSearch = service.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-4 py-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Поиск услуг по городу"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {serviceFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedFilter === filter ? 'bg-yellow-400 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">Доступные услуги</h2>

      {loading && <p className="text-sm text-gray-500">Загрузка...</p>}
      {error && <p className="text-sm text-red-500">Ошибка: {error}</p>}

      <div className="space-y-4">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className="overflow-hidden cursor-pointer"
            onClick={() => router.push(`/services/${service.id}`)}
          >
            <img
              src={service.photos?.[0] || '/images/default.png'}
              alt={service.name}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4 space-y-1">
              <h3 className="font-semibold text-base">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.city}</p>
              <p className="text-sm font-medium">от ₽{service.price.toLocaleString()}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-green-600 text-sm font-medium">Доступно</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/services/${service.id}`);
                  }}
                >
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
