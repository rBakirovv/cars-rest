import { Car } from '../types';

interface CarDetailsProps {
  car: Car;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat('ru-RU').format(mileage) + ' км';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const CarDetails = ({ car }: CarDetailsProps) => {

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Бренд</p>
          <p className="font-medium">{car.brand}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Модель</p>
          <p className="font-medium">{car.model}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Год</p>
          <p className="font-medium">{car.year}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Цвет</p>
          <p className="font-medium">{car.color}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Цена</p>
          <p className="font-medium">{formatPrice(car.price)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Пробег</p>
          <p className="font-medium">{formatMileage(car.mileage)}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500">VIN</p>
        <p className="font-mono font-medium">{car.vin}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Добавлен</p>
        <p className="font-medium">{formatDate(car.createdAt)}</p>
      </div>
    </div>
  );
};
