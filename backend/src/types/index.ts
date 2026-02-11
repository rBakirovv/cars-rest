export interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  created_at: Date;
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
  created_at: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Express.Request {
  user?: JwtPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
