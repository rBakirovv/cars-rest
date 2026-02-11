import { useForm } from 'react-hook-form';
import { Car, CarFormData } from '../types';

interface CarFormProps {
  car?: Car;
  onSubmit: (data: CarFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const CarForm = ({ car, onSubmit, onCancel, isLoading }: CarFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormData>({
    defaultValues: car
      ? {
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          color: car.color,
          vin: car.vin,
        }
      : undefined,
  });

  const currentYear = new Date().getFullYear();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Бренд</label>
          <input
            type="text"
            {...register('brand', { required: 'Поле обязательно' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Модель</label>
          <input
            type="text"
            {...register('model', { required: 'Поле обязательно' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Год</label>
          <input
            type="number"
            {...register('year', {
              required: 'Поле обязательно',
              min: { value: 1900, message: 'Год не может быть раньше 1900' },
              max: { value: currentYear + 1, message: `Год не может превышать ${currentYear + 1}` },
              valueAsNumber: true,
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Цвет</label>
          <input
            type="text"
            {...register('color', { required: 'Поле обязательно' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Цена (₽)</label>
          <input
            type="number"
            {...register('price', {
              required: 'Поле обязательно',
              min: { value: 1, message: 'Цена должна быть больше 0' },
              valueAsNumber: true,
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Пробег (км)</label>
          <input
            type="number"
            {...register('mileage', {
              required: 'Поле обязательно',
              min: { value: 0, message: 'Пробег не может быть отрицательным' },
              valueAsNumber: true,
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.mileage && (
            <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">VIN</label>
        <input
          type="text"
          {...register('vin', {
            required: 'Поле обязательно',
            minLength: { value: 17, message: 'VIN должен содержать ровно 17 символов' },
            maxLength: { value: 17, message: 'VIN должен содержать ровно 17 символов' },
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase"
          maxLength={17}
        />
        {errors.vin && (
          <p className="mt-1 text-sm text-red-600">{errors.vin.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Сохранение...' : car ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};
