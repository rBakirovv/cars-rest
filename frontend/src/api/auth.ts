import { apiClient, setToken, removeToken } from './client';
import { ApiResponse, AuthResponse, User } from '../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient<ApiResponse<AuthResponse>>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (response.data) {
    setToken(response.data.token);
    return response.data;
  }

  throw new Error('Login failed');
};

export const register = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> => {
  const response = await apiClient<ApiResponse<AuthResponse>>('/auth/register', {
    method: 'POST',
    body: { email, password, name },
  });

  if (response.data) {
    setToken(response.data.token);
    return response.data;
  }

  throw new Error('Registration failed');
};

export const logout = (): void => {
  removeToken();
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient<ApiResponse<{ user: User }>>('/auth/me');

  if (response.data) {
    return response.data.user;
  }

  throw new Error('Failed to get user');
};
