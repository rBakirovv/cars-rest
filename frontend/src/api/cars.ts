import { apiClient } from './client';
import { ApiResponse, Car, CarFormData, SortOrder } from '../types';

interface GetCarsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export const getCars = async (params: GetCarsParams = {}): Promise<ApiResponse<Car[]>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const query = searchParams.toString();
  return apiClient<ApiResponse<Car[]>>(`/cars${query ? `?${query}` : ''}`);
};

export const getCar = async (id: number): Promise<Car> => {
  const response = await apiClient<ApiResponse<Car>>(`/cars/${id}`);

  if (response.data) {
    return response.data;
  }

  throw new Error('Failed to get car');
};

export const createCar = async (data: CarFormData): Promise<Car> => {
  const response = await apiClient<ApiResponse<Car>>('/cars', {
    method: 'POST',
    body: data,
  });

  if (response.data) {
    return response.data;
  }

  throw new Error('Failed to create car');
};

export const updateCar = async (id: number, data: CarFormData): Promise<Car> => {
  const response = await apiClient<ApiResponse<Car>>(`/cars/${id}`, {
    method: 'PUT',
    body: data,
  });

  if (response.data) {
    return response.data;
  }

  throw new Error('Failed to update car');
};

export const deleteCar = async (id: number): Promise<void> => {
  await apiClient<ApiResponse<{ message: string }>>(`/cars/${id}`, {
    method: 'DELETE',
  });
};
