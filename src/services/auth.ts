import apiClient from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user?: User;
  access_token?: string;
  accessToken?: string;
  data?: {
    accessToken?: string;
    user?: User;
  }
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', { email, password, name });
  return response.data;
};
