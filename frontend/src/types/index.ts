export interface User {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  vin: string;
  createdAt: string;
}

export interface CarFormData {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  vin: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}
